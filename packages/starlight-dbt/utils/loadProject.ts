// adapted from https://github.com/dbt-labs/dbt-docs/blob/e03a7912f50d0ceb770fb77b99a059d57f810a9c/src/app/services/project_service.js
import merge from 'deepmerge';

import { getQuoteChar } from './compat';
import { loadManifestV12, loadCatalogV1 } from './loadArtifacts';

import type {
	AugmentedMacro,
	AugmentedMacros,
	AugmentedColumnNode,
	CatalogArtifact,
	JsonInput,
	ManifestArtifact,
	ManifestNode,
	Project,
	ProjectService,
	TestInfo,
} from './types';

/**
 * Match the keys of an object to a set of destination keys ignoring case.
 *
 * This will return a new object where each original key is replaced by the
 * matching key from `dest_keys` (matched case-insensitively). If no match is
 * found, the original key is preserved.
 *
 * @param dest_keys - Array of desired keys to map to (case preserved)
 * @param obj - Source object whose keys should be matched
 * @returns A new object with keys mapped to the matching keys from `dest_keys`
 */
function match_dict_keys(dest_keys: string[], obj: any) {
	const new_obj: any = {};

	Object.entries(obj).forEach(([key, value]) => {
		const desired_key = dest_keys.find((k) => k.toLowerCase() === key.toLowerCase());
		new_obj[desired_key || key] = value;
	});

	return new_obj;
}

/**
 * Incorporate catalog information into a manifest.
 *
 * - Copies `sources` into `nodes` on the catalog so both manifests and
 *   catalogs can be merged consistently.
 * - For each node in the manifest that also exists in the catalog, re-map the
 *   node's column keys to match the column names from the catalog using
 *   `match_dict_keys` (case-insensitive mapping).
 * - Returns the merged result of `catalog` and `manifest` where later keys
 *   from the manifest will override catalog entries where appropriate.
 *
 * @param manifest - Parsed manifest artifact (v12)
 * @param catalog - Parsed catalog artifact (v1)
 * @returns The merged project object combining catalog and manifest
 */
function incorporate_catalog(manifest: ManifestArtifact, catalog: CatalogArtifact) {
	// Re-combine sources and nodes
	Object.entries(catalog.sources).forEach(([source_id, source]) => {
		catalog.nodes[source_id] = source;
	});

	// later elements are preferred in the merge, but it
	// shouldn't matter, as these two don't clobber each other
	Object.entries(manifest.nodes).forEach(([node_id, node]) => {
		const catalog_entry = catalog.nodes[node_id];
		if (!catalog_entry) return;

		const catalog_column_names = Object.keys(catalog_entry.columns);
		node.columns = match_dict_keys(catalog_column_names, node.columns);
	});

	return merge(catalog, manifest);
}

/**
 * Consolidate adapter macros by grouping them and marking implementations per adapter.
 *
 * Adapter macros are those that call the `adapter_macro(...)` helper in their
 * `macro_sql`. This function will collect those adapter macros, attach the
 * source SQL under the `impls['Adapter Macro']` key and mark the macro with
 * `is_adapter_macro = true`.
 *
 * It will also locate adapter-specific implementations named like
 * `<adapter>__<macro_name>` (for example `postgres__my_macro`) and attach
 * those SQL bodies to the `impls` map under the adapter key.
 *
 * The returned array contains the consolidated top-level adapter macros first,
 * followed by the remaining macros that were not adapter-specific
 * implementations.
 *
 * @param macros - A collection of macros (ManifestMacros)
 * @param _adapter - Optional adapter name (unused, kept for compatibility)
 * @returns An array of macros with adapter implementations consolidated
 */
export function consolidateAdapterMacros(
	macros: AugmentedMacros,
	_adapter?: string | null
): AugmentedMacro[] {
	// Collect macros that define an adapter_macro
	const adapter_macros: AugmentedMacros = {};
	Object.values(macros).forEach((macro) => {
		if (/{{\s*adapter_macro\([^)]+\)\s+}}/.test(macro.macro_sql)) {
			macro.impls = { 'Adapter Macro': macro.macro_sql };
			macro.is_adapter_macro = true;
			adapter_macros[macro.name] = macro;
		}
	});

	// Known databases/adapters (TODO: extract to global constant)
	const databases = ['postgres', 'redshift', 'bigquery', 'snowflake', 'spark', 'presto', 'default'];

	// Process other macros that are adapter-specific implementations
	const extras = Object.values(macros).filter((macro) => {
		if (macro.name in adapter_macros) {
			return false; // already processed as an adapter_macro, exclude from extras
		}

		const parts = macro.name.split('__');
		const head = parts.shift();
		const macro_name = parts.join('__');

		if (head && databases.includes(head) && adapter_macros[macro_name]) {
			adapter_macros[macro_name].impls ??= {};
			adapter_macros[macro_name].impls[head] = macro.macro_sql;
			adapter_macros[macro_name].is_adapter_macro_impl = true;
			return false; // exclude this macro from extras
		}

		return true; // keep in extras
	});

	return Object.values(adapter_macros).concat(extras);
}

/**
 * Clean and consolidate project macros.
 *
 * - Groups macros by `package_name`.
 * - Filters out macros from the `dbt` package and (optionally) the
 *   `dbt_<adapter>` package (these are considered framework/internal macros).
 * - For each remaining package, consolidates adapter macros via
 *   `consolidateAdapterMacros` and returns a map keyed by `unique_id`.
 *
 * @param macros - All macros from the parsed manifest
 * @param adapter - Optional adapter name to filter `dbt_<adapter>` package
 * @returns A map of consolidated macros keyed by `unique_id`
 */
function clean_project_macros(macros: AugmentedMacros, adapter?: string | null) {
	// Step 1: group macros by package_name
	const packageMacros: Record<string, AugmentedMacros> = {};

	Object.values(macros).forEach((macro) => {
		const pkg = macro.package_name;

		if (!packageMacros[pkg]) {
			packageMacros[pkg] = {};
		}

		packageMacros[pkg][macro.name] = macro;
	});

	// Step 2: consolidate + filter packages
	const consolidated: AugmentedMacro[] = [];

	Object.entries(packageMacros).forEach(([packageName, pkgMacros]) => {
		if (packageName === 'dbt' || (adapter && packageName === `dbt_${adapter}`)) {
			return;
		}

		const result = consolidateAdapterMacros(pkgMacros, adapter);
		consolidated.push(...result);
	});

	// Step 3: key by unique_id
	const result: AugmentedMacros = {};

	consolidated.forEach((macro) => {
		result[macro.unique_id] = macro;
	});

	return result;
}

/**
 * Load and augment a dbt project from manifest and catalog inputs.
 *
 * This function performs the following high-level steps:
 * - Parses the manifest and catalog inputs (accepts either file paths or
 *   already-parsed JSON objects).
 * - Re-attaches sources, exposures, metrics, semantic models, saved queries,
 *   and unit tests into the manifest `nodes` map so site/UI code can treat
 *   them uniformly.
 * - Cleans and consolidates macros (removing internal `dbt` macros and
 *   consolidating adapter-specific implementations).
 * - Merges catalog information into the manifest to produce an augmented
 *   project object, then populates searchable structures and attaches tests
 *   to columns.
 *
 * The provided `service` object will be mutated in-place; `service.project`
 * will be set to the resulting merged project and `service.loaded` will be
 * set to `true` on success.
 *
 * @param service - ProjectService to populate
 * @param manifestInput - File path or parsed manifest JSON
 * @param catalogInput - File path or parsed catalog JSON
 */
export const loadProject = async function (
	service: ProjectService,
	manifestInput: JsonInput,
	catalogInput: JsonInput
) {
	const manifest = await loadManifestV12(manifestInput);
	const catalog = await loadCatalogV1(catalogInput);

	// assign raw manifest first
	service.files.manifest = manifest;
	service.files.catalog = catalog;

	// Set node labels (temporarily narrow to ManifestArtifact nodes)
	Object.values(service.files.manifest.nodes as Record<string, ManifestNode>).forEach((node) => {
		node.label =
			node.resource_type === 'model' && node.version != null
				? `${node.name}_v${node.version}`
				: node.name;
	});

	// Add sources back into nodes to make site logic work
	Object.values(service.files.manifest.sources).forEach((node) => {
		node.label = `${node.source_name}.${node.name}`;
		service.files.manifest.nodes[node.unique_id] = node;
	});

	// Add exposures back into nodes to make site logic work
	Object.values(service.files.manifest.exposures).forEach((node) => {
		// Since label is a new field for exposures we don't want to
		// immediately make docs unusable because the label is empty.
		// This will default the label to be the name when not filled.
		if (!node.label) {
			node.label = node.name;
		}
		service.files.manifest.nodes[node.unique_id] = node;
	});

	// Add metrics back into nodes to make site logic work
	Object.values(service.files.manifest.metrics).forEach((node) => {
		service.files.manifest.nodes[node.unique_id] = node;
	});

	// Add semantic models back into nodes to make site logic work
	Object.values(service.files.manifest.semantic_models).forEach((node) => {
		service.files.manifest.nodes[node.unique_id] = node;
		node.label = node.name;
	});

	// Add saved queries back into nodes to make site logic work
	Object.values(service.files.manifest.saved_queries).forEach((node) => {
		service.files.manifest.nodes[node.unique_id] = node;
		node.label = node.name;
	});

	// Add unit tests into nodes
	Object.values(service.files.manifest.unit_tests).forEach((node) => {
		service.files.manifest.nodes[node.unique_id] = node;
		node.label = node.name;
	});

	/* ---- macros ---- */
	const adapter = service.files.manifest.metadata.adapter_type;
	const macros = clean_project_macros(service.files.manifest.macros, adapter);
	service.files.manifest.macros = macros;

	const project = incorporate_catalog(
		service.files.manifest as ManifestArtifact,
		service.files.catalog
	);

	/* ---- model lookup by name ---- */
	const models = Object.values(project.nodes);
	const model_names = Object.fromEntries(models.map((m) => [m.name, m]));

	/* ---- tests ---- */
	const tests = models.filter((n) => n.resource_type === 'test');
	tests.forEach((test) => {
		if (!('test_metadata' in test)) return;

		const { test_metadata } = test;

		const test_name = test_metadata.namespace
			? `${test_metadata.namespace}.${test_metadata.name}`
			: test_metadata.name;

		const test_info: TestInfo = { test_name };

		if (test_metadata.name === 'not_null') {
			test_info.short = 'N';
			test_info.label = 'Not Null';
		} else if (test_metadata.name === 'unique') {
			test_info.short = 'U';
			test_info.label = 'Unique';
		} else if (test_metadata.name === 'relationships') {
			const rel_model_name = test.refs?.[0]?.name;

			if (rel_model_name && test_metadata.kwargs?.field) {
				const rel_model = model_names[rel_model_name];
				test_info.fk_field = test_metadata.kwargs.field as string;
				test_info.fk_model = rel_model;
			}

			test_info.short = 'F';
			test_info.label = 'Foreign Key';
		} else if (test_metadata.name === 'accepted_values') {
			const values = Array.isArray(test_metadata.kwargs?.values)
				? test_metadata.kwargs.values.join(', ')
				: JSON.stringify(test_metadata.kwargs?.values);

			test_info.short = 'A';
			test_info.label = `Accepted Values: ${values}`;
		} else {
			const { _column_name, ...restKwargs } = test_metadata.kwargs || {};
			test_info.short = '+';
			test_info.label = `${test_name}(${JSON.stringify(restKwargs)})`;
		}

		/* ---- attach tests to columns ---- */
		const depends_on = test.depends_on?.nodes ?? [];
		const test_column =
			test.column_name ||
			(test_metadata.kwargs?.column_name as string) ||
			(test_metadata.kwargs?.arg as string);

		if (!depends_on.length || !test_column) return;

		const model_id =
			test_metadata.name === 'relationships' ? depends_on[depends_on.length - 1]! : depends_on[0]!;

		const node: AugmentedColumnNode | undefined = project.nodes[model_id];
		if (!node?.columns) return;

		const quote_char = getQuoteChar(project.metadata);

		const test_column_name =
			test_column.startsWith(quote_char) && test_column.endsWith(quote_char)
				? test_column.slice(1, -1)
				: test_column;

		const column =
			node.columns[test_column_name] ||
			Object.values(node.columns).find(
				(c) => c.name.toLowerCase() === test_column_name.toLowerCase()
			);

		if (!column) return;

		column.tests ||= [];
		column.tests.push(test_info);
	});

	/* ---- searchable ---- */
	const searchable_types = new Set([
		'model',
		'source',
		'seed',
		'snapshot',
		'analysis',
		'exposure',
		'metric',
		'semantic_model',
		'saved_query',
	]);

	const search_macros = Object.values(project.macros as AugmentedMacros).filter(
		(m) => !m.is_adapter_macro_impl
	);

	const search_nodes = Object.values(project.nodes).filter((n) =>
		searchable_types.has(n.resource_type)
	);

	(project as Project).searchable = [...search_nodes, ...search_macros].filter(
		(obj) => !obj.docs || obj.docs.show
	);

	service.project = project;

	service.loaded = true;
};
