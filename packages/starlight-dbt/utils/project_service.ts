// adapted from https://github.com/dbt-labs/dbt-docs/blob/e03a7912f50d0ceb770fb77b99a059d57f810a9c/src/app/services/project_service.js
import { loadManifestV12, loadCatalogV1 } from './loadArtifacts';
import { getQuoteChar } from './compat';
import type {
	JsonInput,
	ManifestArtifact,
	CatalogArtifact,
	AugmentedCatalogArtifact,
	AugmentedMacro,
	AugmentedManifestArtifact,
	ManifestNode,
	AugmentedMacros,
	AugmentedColumnNode,
	TestInfo,
	Project,
	ProjectService,
} from './types';
import merge from 'deepmerge';

function match_dict_keys(dest_keys: string[], obj: any) {
	const new_obj: any = {};

	Object.entries(obj).forEach(([key, value]) => {
		const desired_key = dest_keys.find((k) => k.toLowerCase() === key.toLowerCase());
		new_obj[desired_key || key] = value;
	});

	return new_obj;
}

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
 * @param macros - A collection of macros (ManifestMacros)
 * @param adapter - Current adapter type (e.g., 'postgres', 'bigquery')
 * @returns An array of macros with adapter implementations consolidated
 */
export function consolidateAdapterMacros(
	macros: AugmentedMacros,
	adapter?: string | null
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

	// Known databases/adapters
	const databases = ['postgres', 'redshift', 'bigquery', 'snowflake', 'spark', 'presto', 'default'];

	// All top-level adapter macros
	const toReturn = Object.values(adapter_macros);

	// Process other macros that are adapter-specific implementations
	const extras = Object.values(macros).filter((macro) => {
		const parts = macro.name.split('__');
		const head = parts.shift();
		const macro_name = parts.join('__');

		if (head && databases.includes(head) && adapter_macros[macro_name]) {
			adapter_macros[macro_name].impls ??= {};
			adapter_macros[macro_name].impls[head] = macro.macro_sql;
			macro.is_adapter_macro_impl = true;
			return false; // exclude this macro from extras
		}

		return true; // keep in extras
	});

	return toReturn.concat(extras);
}

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

const loadProject = async function (
	service: ProjectService,
	manifestInput: JsonInput,
	catalogInput: JsonInput
) {
	let manifest = await loadManifestV12(manifestInput);
	let catalog = await loadCatalogV1(catalogInput);

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
			const { column_name, ...restKwargs } = test_metadata.kwargs || {};
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

export function createProjectService(manifestInput: JsonInput, catalogInput: JsonInput) {
	let service: ProjectService = {
		project: {} as AugmentedManifestArtifact & AugmentedCatalogArtifact,
		tree: {
			project: [],
			database: [],
			sources: [],
		},
		files: {
			manifest: {} as ManifestArtifact,
			catalog: {} as CatalogArtifact,
		},
		loaded: false,
		init: () => loadProject(service, manifestInput, catalogInput),
	};

	return service;
}
