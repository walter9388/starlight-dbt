import type {
	TreeItem,
	SourceValues,
	ExposureValues,
	MetricValues,
	SemanticModelValues,
	SavedQueryValues,
} from './types';

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
 * Retrieve a folder `TreeItem` from the provided map by `name`, creating and
 * inserting a new folder if one does not already exist.
 *
 * - Ensures callers always receive a `TreeItem` of type `folder` with an
 *   initialized `items` array.
 * - Does not mutate the returned folder's `active` or `items` beyond
 *   creation; callers may update those fields as needed.
 *
 * @param map - A `Map` keyed by folder name storing `TreeItem` folders
 * @param name - The folder name to retrieve or create
 * @returns The existing or newly-created `TreeItem` for the folder
 */
function getOrCreateFolder(map: Map<string, TreeItem>, name: string): TreeItem {
	let folder = map.get(name);
	if (!folder) {
		folder = { type: 'folder', name, active: false, items: [] };
		map.set(name, folder);
	}
	return folder;
}

/**
 * Return a new array of `TreeItem` folders sorted by folder `name`, where
 * each folder's `items` array is also sorted by item `name`.
 *
 * This function does not mutate the input: it creates shallow copies of the
 * group objects and their `items` arrays then applies locale-aware sorting.
 *
 * @param treeItems - Array of folder `TreeItem`s to sort
 * @returns New array of sorted `TreeItem` folders with sorted `items`
 */
function sortTreeItems(treeItems: TreeItem[]): TreeItem[] {
	return treeItems
		.map((group) => ({
			...group,
			items: [...group.items!].sort((a, b) => a.name.localeCompare(b.name)),
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Build a hierarchical tree of sources grouped by `source_name`.
 *
 * - Groups source nodes under a folder per `source_name`.
 * - Each folder is a `TreeItem` with `items` containing file `TreeItem`s for
 *   each source node (uses the node's `name`).
 * - Marks the folder `active` if any child matches `select` and marks the
 *   child file `active` when its `unique_id` equals `select`.
 * - File items include `node`, `unique_id`, and `node_type: 'source'`.
 *
 * @param nodes - Array of source nodes from the project manifest
 * @param select - Optional unique_id to mark a node (and its parent) active
 * @returns Array of `TreeItem` folders sorted by name, each containing sorted items
 */
export function buildSourceTree(nodes: SourceValues[], select?: string): TreeItem[] {
	const sources = new Map<string, TreeItem>();

	for (const node of nodes) {
		const source_name = node.source_name;
		const source = getOrCreateFolder(sources, source_name);
		
		const isActive = node.unique_id === select;
		if (isActive) {
			source.active = true;
		}

		source.items!.push({
			type: 'file',
			name: node.name,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: 'source',
		});
	}

	return sortTreeItems([...sources.values()]);
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
	const exposures = new Map<string, TreeItem>();

	for (const node of nodes) {
		const name = capitalizeType(node.type ?? 'Uncategorized');
		const exposure = getOrCreateFolder(exposures, name);
		
		const isActive = node.unique_id === select;
		if (isActive) {
			exposure.active = true;
		}

		exposure.items!.push({
			type: 'file',
			name: node.label ?? node.name,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: 'exposure',
		});
	}

	return sortTreeItems([...exposures.values()]);
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
	const metrics = new Map<string, TreeItem>();

	for (const node of nodes) {
		const project = node.package_name;
		const metric = getOrCreateFolder(metrics, project);
		
		const isActive = node.unique_id === select;
		if (isActive) {
			metric.active = true;
		}

		metric.items!.push({
			type: 'file',
			name: node.label ?? node.name,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: 'metric',
		});
	}

	return sortTreeItems([...metrics.values()]);
}

/**
 * Build a hierarchical tree of semantic models grouped by `package_name`.
 *
 * - Groups semantic model nodes under a folder per `package_name`.
 * - Each folder is a `TreeItem` with `items` containing file `TreeItem`s for
 *   each semantic model (uses the node's `name`).
 * - Marks the folder `active` if any child matches `select` and marks the
 *   child file `active` when its `unique_id` equals `select`.
 * - File items include `node`, `unique_id`, and `node_type: 'semantic_model'`.
 *
 * @param nodes - Array of semantic model nodes from the project manifest
 * @param select - Optional unique_id to mark a node (and its parent) active
 * @returns Array of `TreeItem` folders sorted by name, each containing sorted items
 */
export function buildSemanticModelTree(nodes: SemanticModelValues[], select?: string): TreeItem[] {
	const models = new Map<string, TreeItem>();

	for (const node of nodes) {
		const project = node.package_name;
		const model = getOrCreateFolder(models, project);
		
		const isActive = node.unique_id === select;
		if (isActive) {
			model.active = true;
		}

		model.items!.push({
			type: 'file',
			name: node.name,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: 'semantic_model',
		});
	}

	return sortTreeItems([...models.values()]);
}

/**
 * Build a hierarchical tree of saved queries grouped by `package_name`.
 *
 * - Groups saved query nodes under a folder per `package_name`.
 * - Each folder is a `TreeItem` with `items` containing file `TreeItem`s for
 *   each saved query (uses the node's `name`).
 * - Marks the folder `active` if any child matches `select` and marks the
 *   child file `active` when its `unique_id` equals `select`.
 * - File items include `node`, `unique_id`, and `node_type: 'saved_query'`.
 *
 * @param nodes - Array of saved query nodes from the project manifest
 * @param select - Optional unique_id to mark a node (and its parent) active
 * @returns Array of `TreeItem` folders sorted by name, each containing sorted items
 */
export function buildSavedQueryTree(nodes: SavedQueryValues[], select?: string): TreeItem[] {
	const queries = new Map<string, TreeItem>();

	for (const node of nodes) {
		const project = node.package_name;
		const query = getOrCreateFolder(queries, project);
		
		const isActive = node.unique_id === select;
		if (isActive) {
			query.active = true;
		}

		query.items!.push({
			type: 'file',
			name: node.name,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: 'saved_query',
		});
	}

	return sortTreeItems([...queries.values()]);
}
