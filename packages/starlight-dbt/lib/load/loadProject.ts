// adapted from https://github.com/dbt-labs/dbt-docs/blob/e03a7912f50d0ceb770fb77b99a059d57f810a9c/src/app/services/project_service.js

import {
	buildDatabaseTree,
	buildExposureTree,
	buildGroupTree,
	buildMetricTree,
	buildProjectTree,
	buildSavedQueryTree,
	buildSemanticModelTree,
	buildSourceTree,
} from './buildNodeTrees';
import { cleanProjectMacros } from './cleanProjectMacros';
import { getQuoteChar } from './compat';
import { incorporate_catalog } from './incorporateCatalog';
import { loadManifestV12, loadCatalogV1 } from './loadArtifacts';

import type {
	AugmentedMacros,
	AugmentedColumnNode,
	JsonInput,
	ManifestArtifact,
	ManifestNode,
	Project,
	ProjectService,
	TestInfo,
	FilterProjectNode,
} from './types';

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
	const macros = cleanProjectMacros(service.files.manifest.macros, adapter);
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

/**
 * Populates the various hierarchical project trees in the given `ProjectService`.
 *
 * - Filters nodes from the project by accepted resource types and custom tests.
 * - Extracts macros from the project.
 * - Builds trees for:
 *   - `database` → schema → table (`buildDatabaseTree`)
 *   - grouped models by `group` property (`buildGroupTree`)
 *   - project files & macros (`buildProjectTree`)
 *   - sources (`buildSourceTree`)
 *   - exposures (`buildExposureTree`)
 *   - metrics (`buildMetricTree`)
 *   - semantic models (`buildSemanticModelTree`)
 *   - saved queries (`buildSavedQueryTree`)
 * - Assigns the resulting trees to `service.tree`.
 *
 * @param service - The `ProjectService` instance containing project nodes, macros, and tree storage
 * @returns Promise<void> that resolves when all trees have been populated
 */
export const populateModelTree = async function (service: ProjectService) {
	// get nodes/macros from service.project
	const acceptedNodeTypes = [
		'snapshot',
		'source',
		'seed',
		'model',
		'analysis',
		'exposure',
		'metric',
		'semantic_model',
		'saved_query',
	];
	const nodes = Object.values(service.project.nodes).filter((node) => {
		if (!('resource_type' in node)) return false;

		// Include custom singular tests
		if (node.resource_type === 'test' && !('test_metadata' in node)) {
			return true;
		}

		// Include nodes with accepted resource types
		return acceptedNodeTypes.includes(node.resource_type);
	}) as FilterProjectNode[];
	const macros = Object.values(service.project.macros);

	// build trees
	service.tree.database = buildDatabaseTree(nodes);
	service.tree.groups = buildGroupTree(nodes);
	service.tree.project = buildProjectTree(nodes, macros);
	service.tree.sources = buildSourceTree(Object.values(service.project.sources));
	service.tree.exposures = buildExposureTree(Object.values(service.project.exposures));
	service.tree.metrics = buildMetricTree(Object.values(service.project.metrics));
	service.tree.semantic_models = buildSemanticModelTree(
		Object.values(service.project.semantic_models)
	);
	service.tree.saved_queries = buildSavedQueryTree(Object.values(service.project.saved_queries));
};
