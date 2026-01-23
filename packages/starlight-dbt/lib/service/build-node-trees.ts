import type {
	SourceValues,
	ExposureValues,
	MetricValues,
	SemanticModelValues,
	SavedQueryValues,
	MacroValues,
	FilterProjectNode,
	TreeFolder,
	TreeFile,
	TreeItem,
	TreeNodeType,
	UnitTestValues,
} from './types';

/**
 * Capitalizes the first character of a string.
 *
 * @param type - Input string
 * @returns String with the first character uppercased
 */
function capitalizeType(type: string): string {
	return type.charAt(0).toUpperCase() + type.slice(1);
}

/**
 * Retrieves a folder from a map by name, creating it if it does not exist.
 *
 * Ensures the returned item is a folder and throws if a name collision
 * occurs with a non-folder item.
 *
 * @param map - Map of folder name to TreeItem
 * @param name - Folder name
 * @returns TreeFolder for the given name
 */
function getOrCreateFolder<T>(map: Record<string, TreeItem<T>>, name: string): TreeFolder<T> {
	let item = map[name];
	if (!item) {
		item = {
			type: 'folder',
			name,
			active: false,
			items: [],
		};
		map[name] = item;
	}
	if (item.type !== 'folder') {
		throw new Error(`Expected folder for ${name}`);
	}
	return item;
}

function isDocsVisible(node: unknown): boolean {
	if (typeof node !== 'object' || node === null) return true;
	if (!('docs' in node)) return true;

	const docs = (node as { docs?: { show?: boolean } }).docs;
	return docs?.show !== false;
}

export function isFolder<T>(item: TreeItem<T>): item is TreeFolder<T> {
	return item.type !== 'file' && item.type !== 'table';
}

export function assertFolder<T>(item: TreeItem<T>): asserts item is TreeFolder<T> {
	if (!isFolder(item)) {
		throw new Error(`Expected folder, got ${item.type}`);
	}
}

/**
 * Recursively normalizes and sorts a tree.
 *
 * - Sorts items at every level by name
 * - Applies the same ordering to all nested folders
 *
 * @typeParam T - Underlying node type
 * @param items - Tree items to normalize
 * @returns Sorted tree with normalized child ordering
 */
function normalizeTree<T extends TreeItem<unknown>>(items: T[]): T[] {
	return items
		.map((item) => (isFolder(item) ? ({ ...item, items: normalizeTree(item.items) } as T) : item))
		.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Build a grouped folder → file tree from a flat list of nodes.
 *
 * Nodes are grouped using a derived key. Each group becomes a folder
 * containing file items for the nodes in that group.
 *
 * @typeParam T - Node type being grouped
 * @param nodes - Flat list of nodes to group
 * @param groupKey - Function that derives the folder name for a node
 * @param nodeType - UI node type for file items
 * @param select - Optional unique_id to mark a node (and its parent) active
 * @param labelKey - Optional property to use as the file label instead of `name`
 * @returns Sorted folder TreeItems with sorted file children
 */
function buildGroupedTree<
	T extends
		| SourceValues
		| ExposureValues
		| MetricValues
		| SemanticModelValues
		| SavedQueryValues
		| UnitTestValues,
>(
	nodes: T[],
	groupKey: (node: T) => string,
	nodeType: TreeNodeType,
	select?: string,
	labelKey?: keyof T
): TreeFolder<T>[] {
	const groups: Record<string, TreeFolder<T>> = {};

	for (const node of nodes) {
		const groupName = groupKey(node);
		const folder = getOrCreateFolder<T>(groups, groupName);

		const isActive = node.unique_id === select;
		if (isActive) folder.active = true;

		const fileName = labelKey ? String(node[labelKey] ?? node.name) : node.name;

		folder.items.push({
			type: 'file',
			name: fileName,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: nodeType,
		});
	}

	return Object.values(groups)
		.map((group) => ({
			...group,
			items: [...group.items].sort((a, b) => a.name.localeCompare(b.name)),
		}))
		.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Build a tree of sources grouped by `source_name`.
 *
 * @param nodes - Source nodes from the project manifest
 * @param select - Optional unique_id to mark a source (and its folder) active
 * @returns Tree of source folders containing file items
 */
export function buildSourceTree(
	nodes: SourceValues[],
	select?: string
): TreeFolder<SourceValues>[] {
	return buildGroupedTree(nodes, (n) => n.source_name, 'source', select);
}

/**
 * Build a tree of exposures grouped by type.
 *
 * Groups by capitalized `type`, falling back to `Uncategorized`.
 *
 * @param nodes - Exposure nodes from the project manifest
 * @param select - Optional unique_id to mark an exposure (and its folder) active
 * @returns Tree of exposure folders containing file items
 */
export function buildExposureTree(
	nodes: ExposureValues[],
	select?: string
): TreeFolder<ExposureValues>[] {
	return buildGroupedTree(
		nodes,
		(n) => capitalizeType(n.type ?? 'Uncategorized'),
		'exposure',
		select,
		'label'
	);
}

/**
 * Build a tree of metrics grouped by `package_name`.
 *
 * Uses the metric `label` as the display name when available.
 *
 * @param nodes - Metric nodes from the project manifest
 * @param select - Optional unique_id to mark a metric (and its folder) active
 * @returns Tree of metric folders containing file items
 */
export function buildMetricTree(
	nodes: MetricValues[],
	select?: string
): TreeFolder<MetricValues>[] {
	return buildGroupedTree(nodes, (n) => n.package_name, 'metric', select, 'label');
}

/**
 * Build a tree of semantic models grouped by `package_name`.
 *
 * @param nodes - Semantic model nodes from the project manifest
 * @param select - Optional unique_id to mark a model (and its folder) active
 * @returns Tree of semantic model folders containing file items
 */
export function buildSemanticModelTree(
	nodes: SemanticModelValues[],
	select?: string
): TreeFolder<SemanticModelValues>[] {
	return buildGroupedTree(nodes, (n) => n.package_name, 'semantic_model', select);
}

/**
 * Build a tree of saved queries grouped by `package_name`.
 *
 * @param nodes - Saved query nodes from the project manifest
 * @param select - Optional unique_id to mark a query (and its folder) active
 * @returns Tree of saved query folders containing file items
 */
export function buildSavedQueryTree(
	nodes: SavedQueryValues[],
	select?: string
): TreeFolder<SavedQueryValues>[] {
	return buildGroupedTree(nodes, (n) => n.package_name, 'saved_query', select);
}

/**
 * Build a tree of unit tests grouped by their test type.
 *
 * @param nodes - Unit test nodes from the project manifest
 * @param select - Optional unique_id to mark a test (and its folder) active
 * @returns Tree of unit test folders containing file items
 */
export function buildUnitTestTree(
	nodes: UnitTestValues[],
	select?: string
): TreeFolder<UnitTestValues>[] {
	return buildGroupedTree(nodes, (n) => n.package_name, 'test', select);
}

/**
 * Builds the main project file tree from models and macros.
 *
 * - Groups nodes by package and original file path
 * - Respects hidden docs
 * - Marks active nodes and propagates activity to parent folders
 *
 * @param nodes - Filtered project nodes
 * @param macros - Macro nodes
 * @param select - Optional unique_id to mark a node active
 * @returns Hierarchical tree of folders and files
 */
export function buildProjectTree(
	nodes: FilterProjectNode[] = [],
	macros: MacroValues[] = [],
	select?: string
): TreeFolder<FilterProjectNode | MacroValues>[] {
	const root: Record<string, TreeItem<FilterProjectNode | MacroValues>> = {};

	for (const node of [...nodes, ...macros]) {
		if (!isDocsVisible(node)) continue;
		if (!['model', 'analysis', 'snapshot', 'seed', 'macro'].includes(node.resource_type)) continue;

		const isActive = node.unique_id === select;
		const pathParts = node.original_file_path.split(/[\\/]/);
		const fullPath = [node.package_name, ...pathParts];
		const dirPath = fullPath.slice(0, -1);

		const fileName = node.resource_type === 'macro' ? node.name : fullPath.at(-1)!;
		const displayName =
			node.resource_type === 'model' && node.version != null
				? `${node.name}_v${node.version}`
				: node.name;

		let current = root;

		for (const segment of dirPath) {
			const folder = getOrCreateFolder(current, segment);
			if (isActive) folder.active = true;

			// lazily create a children record for building
			if (!(folder as any).children) {
				(folder as any).children = {} as Record<string, TreeItem<FilterProjectNode | MacroValues>>;
			}

			current = (folder as any).children;
		}

		current[fileName] = {
			type: 'file',
			name: displayName,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: node.resource_type,
		};
	}

	// recursively collapse folders and remove children
	const collapse = (
		map: Record<string, TreeItem<FilterProjectNode | MacroValues>>
	): TreeItem<FilterProjectNode | MacroValues>[] =>
		Object.values(map).map((item) => {
			if (item.type === 'folder') {
				const children = (item as any).children as
					| Record<string, TreeItem<FilterProjectNode | MacroValues>>
					| undefined;

				if (children) {
					item.items = collapse(children);
					delete (item as any).children;
				}
			}
			return item;
		});

	return normalizeTree(collapse(root) as TreeFolder<FilterProjectNode | MacroValues>[]);
}

/**
 * Builds a database → schema → table tree.
 *
 * - Filters out hidden and ephemeral models
 * - Groups by database and schema
 * - Marks active nodes and propagates activity
 *
 * @param nodes - Array of project nodes
 * @param select - Optional unique_id to mark a node (and its parent) active
 * @returns Record keyed by database, each containing TreeItem folders
 */
export function buildDatabaseTree(
	nodes: FilterProjectNode[],
	select?: string
): TreeFolder<FilterProjectNode>[] {
	const databases: Record<string, TreeFolder<FilterProjectNode>> = {};
	type DatabaseProjectNode = Extract<
		FilterProjectNode,
		{
			resource_type: 'source' | 'snapshot' | 'seed' | 'model';
		}
	>;

	const visibleNodes = nodes.filter((node): node is DatabaseProjectNode => {
		if (!isDocsVisible(node)) return false;
		if (['source', 'snapshot', 'seed'].includes(node.resource_type)) return true;
		if (node.resource_type === 'model') {
			return node.config?.materialized !== 'ephemeral';
		}
		return false;
	});

	const getDisplayName = (n: DatabaseProjectNode): string => {
		if ('identifier' in n && n.identifier) return n.identifier;
		if ('alias' in n && n.alias) return n.alias;
		return n.name;
	};
	const getSortString = (n: DatabaseProjectNode) =>
		`${n.database}.${n.schema}.${getDisplayName(n)}`;
	const sorted = [...visibleNodes].sort((a, b) => getSortString(a).localeCompare(getSortString(b)));

	for (const node of sorted) {
		const dbName = node.database ?? 'Default';
		const schemaName = node.schema ?? 'public';
		const { unique_id } = node;

		const isActive = unique_id === select;

		if (!databases[dbName]) {
			databases[dbName] = {
				type: 'database',
				name: dbName,
				active: false,
				items: [],
			};
		}
		const database = databases[dbName];

		let schema = database.items.find(
			(item): item is TreeFolder<FilterProjectNode> =>
				item.type === 'schema' && item.name === schemaName
		);

		if (!schema) {
			schema = {
				type: 'schema',
				name: schemaName,
				active: false,
				items: [],
			};
			database.items.push(schema);
		}

		if (isActive) {
			database.active = true;
			schema.active = true;
		}

		schema.items.push({
			type: 'table',
			name: getDisplayName(node),
			node: node,
			active: isActive,
			unique_id: unique_id,
			node_type: 'model',
		});
	}

	return normalizeTree(Object.values(databases));
}

/**
 * Builds a tree grouping project nodes by their `group` property.
 *
 * - Excludes sources, exposures, seeds, and hidden/private nodes
 * - Appends "(protected)" to protected models
 * - Marks active nodes and propagates activity to parent groups
 *
 * @param nodes - Array of project nodes
 * @param select - Optional unique_id to mark a node active
 * @returns Grouped tree of models
 */
export function buildGroupTree(
	nodes: FilterProjectNode[],
	select?: string
): TreeFolder<FilterProjectNode>[] {
	const groups: Record<string, TreeFolder<FilterProjectNode>> = {};

	for (const node of nodes) {
		if (!isDocsVisible(node)) continue;
		if (
			node.resource_type === 'source' ||
			node.resource_type === 'exposure' ||
			node.resource_type === 'seed'
		)
			continue;
		if ('access' in node && node.access === 'private') continue;

		const isActive = node.unique_id === select;

		const baseName =
			node.resource_type === 'model' && 'version' in node && node.version != null
				? `${node.name}_v${node.version}`
				: node.name;

		const displayName =
			'access' in node && node.access === 'protected' ? `${baseName} (protected)` : baseName;

		const groupName = node.group ?? 'Ungrouped';

		const group =
			groups[groupName] ??
			(() => {
				const g: TreeFolder<FilterProjectNode> = {
					type: 'group',
					name: groupName,
					active: false,
					items: [],
				};
				groups[groupName] = g;
				return g;
			})();

		if (isActive) group.active = true;

		group.items.push({
			type: 'file',
			name: displayName,
			node,
			active: isActive,
			unique_id: node.unique_id,
			node_type: 'model',
		});
	}

	return normalizeTree(Object.values(groups));
}

/**
 * Flattens a resource tree into a lookup record keyed by unique_id.
 *
 * - Traverses nested items recursively to find all leaf nodes
 * - Enables $O(1)$ constant-time access to any node by its ID
 * - Preserves original node references for memory efficiency
 *
 * @param items - Array of nested TreeItems
 * @param map - Accumulator for recursion (defaults to empty)
 * @returns Record of unique_id to TreeFile
 */
export function createNodeMap<T>(
	items: TreeItem<T>[],
	map: Record<string, TreeFile<T>> = {}
): Record<string, TreeFile<T>> {
	for (const item of items) {
		if ('items' in item) {
			createNodeMap(item.items, map);
		} else {
			map[item.unique_id] = item;
		}
	}
	return map;
}
