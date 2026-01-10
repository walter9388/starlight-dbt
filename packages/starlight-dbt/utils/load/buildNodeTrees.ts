import type {
	TreeItem,
	SourceValues,
	ExposureValues,
	MetricValues,
	SemanticModelValues,
	SavedQueryValues,
} from './types';

export function buildSourceTree(nodes: SourceValues[], select?: string): TreeItem[] {
	const sources: Record<string, TreeItem> = {};

	for (const node of nodes) {
		const source = node.source_name;
		const isActive = node.unique_id === select;

		if (!sources[source]) {
			sources[source] = {
				type: 'folder',
				name: source,
				active: isActive,
				items: [],
			};
		} else if (isActive) {
			sources[source].active = true;
		}

		(sources[source].items as TreeItem[]).push({
			type: 'file',
			name: node.name,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: 'source',
		});
	}

	return Object.values(sources)
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((source) => ({
			...source,
			items: (source.items as TreeItem[]).sort((a, b) => a.name.localeCompare(b.name)),
		}));
}

/**
 * Capitalize the first character of a type string.
 *
 * @param type - The type string to capitalize
 * @returns The input string with the first character capitalized
 */
function capitalizeType(type: string): string {
	return type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Build a hierarchical tree of exposures grouped by their (capitalized) type.
 *
 * - Groups exposures by `node.type` (capitalized) or `Uncategorized` when
 *   missing.
 * - Each group is a `folder` TreeItem with `items` containing file TreeItems
 *   for each exposure.
 * - Marks the folder `active` if any child matches `select` and marks the
 *   child file `active` when its `unique_id` equals `select`.
 * - File items include `node`, `unique_id`, and `node_type: 'exposure'`.
 *
 * @param nodes - Array of exposure nodes from the project manifest
 * @param select - Optional unique_id to mark a node (and its parent) active
 * @returns Array of `TreeItem` folders sorted by name, each containing sorted items
 */
export function buildExposureTree(nodes: ExposureValues[], select?: string): TreeItem[] {
	const exposures: Record<string, TreeItem> = {};

	for (const node of nodes) {
		const type = capitalizeType(node.type || 'Uncategorized');
		const isActive = node.unique_id === select;

		if (!exposures[type]) {
			exposures[type] = {
				type: 'folder',
				name: type,
				active: isActive,
				items: [],
			};
		} else if (isActive) {
			exposures[type].active = true;
		}

		(exposures[type].items as TreeItem[]).push({
			type: 'file',
			name: node.label || node.name,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: 'exposure',
		});
	}

	return Object.values(exposures)
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((exposure) => ({
			...exposure,
			items: (exposure.items as TreeItem[]).sort((a, b) => a.name.localeCompare(b.name)),
		}));
}

/**
 * Build a hierarchical tree of metrics grouped by `package_name`.
 *
 * - Groups metric nodes under a folder per `package_name`.
 * - Each folder is a `TreeItem` with `items` containing file `TreeItem`s for
 *   each metric (uses `label` if present, otherwise `name`).
 * - Marks the folder `active` if any child matches `select` and marks the
 *   child file `active` when its `unique_id` equals `select`.
 * - File items include `node`, `unique_id`, and `node_type: 'metric'`.
 *
 * @param nodes - Array of metric nodes from the project manifest
 * @param select - Optional unique_id to mark a node (and its parent) active
 * @returns Array of `TreeItem` folders sorted by name, each containing sorted items
 */
export function buildMetricTree(nodes: MetricValues[], select?: string): TreeItem[] {
	const metrics: Record<string, TreeItem> = {};

	for (const node of nodes) {
		const project = node.package_name;
		const isActive = node.unique_id === select;

		if (!metrics[project]) {
			metrics[project] = {
				type: 'folder',
				name: project,
				active: isActive,
				items: [],
			};
		} else if (isActive) {
			metrics[project].active = true;
		}

		(metrics[project].items as TreeItem[]).push({
			type: 'file',
			name: node.label || node.name,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: 'metric',
		});
	}

	return Object.values(metrics)
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((metric) => ({
			...metric,
			items: (metric.items as TreeItem[]).sort((a, b) => a.name.localeCompare(b.name)),
		}));
}

export function buildSemanticModelTree(nodes: SemanticModelValues[], select?: string): TreeItem[] {
	const models: Record<string, TreeItem> = {};

	for (const node of nodes) {
		const project = node.package_name;
		const isActive = node.unique_id === select;

		if (!models[project]) {
			models[project] = {
				type: 'folder',
				name: project,
				active: isActive,
				items: [],
			};
		} else if (isActive) {
			models[project].active = true;
		}

		(models[project].items as TreeItem[]).push({
			type: 'file',
			name: node.name,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: 'semantic_model',
		});
	}

	return Object.values(models)
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((model) => ({
			...model,
			items: (model.items as TreeItem[]).sort((a, b) => a.name.localeCompare(b.name)),
		}));
}

export function buildSavedQueryTree(nodes: SavedQueryValues[], select?: string): TreeItem[] {
	const queries: Record<string, TreeItem> = {};

	for (const node of nodes) {
		const project = node.package_name;
		const isActive = node.unique_id === select;

		if (!queries[project]) {
			queries[project] = {
				type: 'folder',
				name: project,
				active: isActive,
				items: [],
			};
		} else if (isActive) {
			queries[project].active = true;
		}

		(queries[project].items as TreeItem[]).push({
			type: 'file',
			name: node.name,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: 'saved_query',
		});
	}

	return Object.values(queries)
		.sort((a, b) => a.name.localeCompare(b.name))
		.map((query) => ({
			...query,
			items: (query.items as TreeItem[]).sort((a, b) => a.name.localeCompare(b.name)),
		}));
}
