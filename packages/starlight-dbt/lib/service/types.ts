import type { DbtCatalog, DbtCatalogTable } from '../schemas/catalog';
import type {
	ManifestColumnNode,
	ManifestV12Metadata,
	ManifestV12Node,
	ManifestSourceNode,
	ManifestMacroNode,
	ManifestExposureNode,
	ManifestMetricNode,
	ManifestSemanticModelNode,
	ManifestSavedQueryNode,
	ManifestUnitTestNode,
} from '../schemas/manifest';
export type { ManifestColumnNode };

/**
 * Metadata attached to a column-level dbt test.
 *
 * This is derived from `test_metadata` and normalized
 * for use in documentation and UI rendering.
 */
export interface TestInfo {
	/** Fully qualified test name (e.g. `pkg.not_null`) */
	test_name?: string | undefined;

	/** Short code used in the UI (N, U, F, A, +) */
	short?: string;

	/** Human-readable label describing the test */
	label?: string;

	/** Foreign-key field for `relationships` tests */
	fk_field?: string;

	/** Referenced model for `relationships` tests */
	fk_model?: unknown;
}

// --- Manifest node types — derived from generated Zod schemas

/** Union of all dbt manifest resource node types from the generated schema. */
type AnyResourceNode =
	| ManifestV12Node
	| ManifestSourceNode
	| ManifestMacroNode
	| ManifestExposureNode
	| ManifestMetricNode
	| ManifestSemanticModelNode
	| ManifestSavedQueryNode
	| ManifestUnitTestNode;

/** Extracts all possible keys across all members of a union. */
type AllKeysOf<T> = T extends unknown ? keyof T : never;

/**
 * For a given key K, extracts the value type from any union member that has K.
 * Members without K contribute `never` (which drops out of the union).
 */
type ExtractProp<T, K extends PropertyKey> = T extends unknown
	? K extends keyof T
		? T[K]
		: never
	: never;

/** Flattens a union of object types into a single object with all fields optional. */
type FlattenUnion<T> = {
	[K in AllKeysOf<T>]?: ExtractProp<T, K>;
};

/**
 * Flat convenience type for any dbt manifest node.
 *
 * Derived from the generated Zod schema types. Common fields are required;
 * all resource-type-specific fields are optional. Use the precise per-resource
 * types from `schemas/manifest.ts` for fully-typed access.
 */
export type ManifestNode = {
	unique_id: string;
	name: string;
	resource_type: string;
	package_name: string;
	original_file_path: string;
	fqn: string[];
	/** Human-readable display label — augmented by buildProject. */
	label?: string;
} & Omit<
	FlattenUnion<AnyResourceNode>,
	'unique_id' | 'name' | 'resource_type' | 'package_name' | 'original_file_path' | 'fqn' | 'label'
>;

/**
 * Represents a source entry from the manifest `sources` dict, including the
 * `label` field augmented by buildProject.
 */
export type ManifestSource = ManifestNode & {
	resource_type: 'source';
	source_name: string;
	label?: string;
};

/**
 * Represents an exposure entry from the manifest `exposures` dict.
 */
export type ManifestExposure = ManifestNode & {
	resource_type: 'exposure';
	type?: string;
	label?: string;
};

/**
 * Represents a metric entry from the manifest `metrics` dict.
 */
export type ManifestMetric = ManifestNode & {
	resource_type: 'metric';
};

/**
 * Represents a semantic model entry from the manifest `semantic_models` dict.
 */
export type ManifestSemanticModel = ManifestNode & {
	resource_type: 'semantic_model';
	label?: string;
};

/**
 * Represents a saved query entry from the manifest `saved_queries` dict.
 */
export type ManifestSavedQuery = ManifestNode & {
	resource_type: 'saved_query';
	label?: string;
};

/**
 * Represents a unit test entry from the manifest `unit_tests` dict.
 */
export type ManifestUnitTest = ManifestNode & {
	resource_type: 'unit_test';
	label?: string;
};

/**
 * Represents a macro entry from the manifest `macros` dict.
 */
export type ManifestMacro = ManifestNode & {
	resource_type: 'macro';
	macro_sql: string;
	arguments?: unknown[];
};

export type ManifestMacros = Record<string, ManifestMacro>;

// --- Augmented types (post-buildProject)

export type AugmentedMacro = ManifestMacro & {
	impls?: Record<string, string>;
	is_adapter_macro?: boolean;
	is_adapter_macro_impl?: boolean;
};
export type AugmentedMacros = {
	[k: string]: AugmentedMacro;
};

type NonEmptyManifestColumns = NonNullable<ManifestNode['columns']>;
type AugmentedColumns = {
	[K in keyof NonEmptyManifestColumns]: NonEmptyManifestColumns[K] & { tests?: TestInfo[] };
};
export type AugmentedColumnNode = Omit<ManifestNode, 'columns'> & {
	columns?: AugmentedColumns;
};

/**
 * The raw dbt manifest v12 artifact as returned by parseDbtManifest.
 *
 * All top-level dicts use their specific node types.
 * This type is intentionally kept without an index signature so that
 * TypeScript intersections (used in AugmentedManifestArtifact and Project)
 * resolve correctly.
 */
export interface ManifestArtifact {
	metadata: ManifestV12Metadata;
	nodes: Record<string, ManifestNode>;
	sources: Record<string, ManifestSource>;
	macros: Record<string, ManifestMacro>;
	exposures: Record<string, ManifestExposure>;
	metrics: Record<string, ManifestMetric>;
	semantic_models: Record<string, ManifestSemanticModel>;
	saved_queries: Record<string, ManifestSavedQuery>;
	unit_tests: Record<string, ManifestUnitTest>;
}

// used after buildProject to represent combined nodes and sources
export type AugmentedManifestArtifact = Omit<ManifestArtifact, 'nodes'> & {
	nodes: Record<
		string,
		| AugmentedColumnNode
		| ManifestSource
		| ManifestExposure
		| ManifestMetric
		| ManifestSemanticModel
		| ManifestSavedQuery
		| ManifestUnitTest
	>;
	sources: Record<string, ManifestSource>;
	unit_tests: Record<string, ManifestUnitTest>;
};

// --- Catalog types — derived from generated Zod schema (no index signature)

/**
 * The raw dbt catalog v1 artifact as returned by parseDbtCatalog.
 *
 * Aliased from the generated DbtCatalog type, which has no index signature
 * (no `.catchall()` or `.passthrough()`), making it safe to use in TypeScript
 * intersections without causing AugmentedCatalogArtifact or Project properties
 * to resolve to `never`.
 */
export type CatalogArtifact = DbtCatalog;

export type CatalogMetadata = CatalogArtifact['metadata'];
type CatalogNode = DbtCatalogTable;
type CatalogSource = DbtCatalogTable;

// used after buildProject to represent combined nodes and sources
export type AugmentedCatalogArtifact = CatalogArtifact & {
	nodes: Record<string, CatalogNode | CatalogSource>;
};

// --- Combined project type

export type Project = AugmentedManifestArtifact &
	AugmentedCatalogArtifact & { searchable?: (AugmentedColumnNode | AugmentedMacros[string])[] };

/**
 * Union of any node that may appear in a project (manifest or catalog origin).
 */
export type ProjectNode = ManifestNode | CatalogNode;

/**
 * Nodes that appear in the tree views — all resource types displayed in the sidebar
 * except internal manifest types (hook, sql_operation, generic_test, function).
 * The `resource_type` field is narrowed to the accepted values.
 */
export type FilterProjectNode = ManifestNode & {
	resource_type:
		| 'snapshot'
		| 'source'
		| 'seed'
		| 'model'
		| 'analysis'
		| 'exposure'
		| 'metric'
		| 'semantic_model'
		| 'saved_query'
		| 'test';
};

/** Raw artifact files as loaded and parsed from disk. */
export interface DbtArtifacts {
	manifest: Record<string, unknown>;
	catalog: Record<string, unknown>;
}

/**
 * Input accepted by artifact loaders.
 *
 * - A parsed JSON object
 * - A file path pointing to a JSON file
 */
export type JsonInput = string | Record<string, unknown>;

export type DbtSource =
	| { type: 'file'; manifest: string; catalog: string }
	| { type: 'http'; manifest: string; catalog: string }
	| { type: 's3'; bucket: string; region: string; manifestKey: string; catalogKey: string };

export interface DbtService {
	project: Project;
	tree: {
		project: TreeFolder<FilterProjectNode | MacroValues>[];
		database: TreeFolder<FilterProjectNode>[];
		groups: TreeFolder<FilterProjectNode>[];
		sources: TreeFolder<SourceValues>[];
		exposures: TreeFolder<ExposureValues>[];
		metrics: TreeFolder<MetricValues>[];
		semantic_models: TreeFolder<SemanticModelValues>[];
		saved_queries: TreeFolder<SavedQueryValues>[];
		unit_tests: TreeFolder<UnitTestValues>[];
	};
	node_map: Record<
		string,
		TreeFile<FilterProjectNode | MacroValues | SemanticModelValues | UnitTestValues>
	>;
	files: {
		manifest: ManifestArtifact;
		catalog: AugmentedCatalogArtifact;
	};
	loaded: boolean;
	init: () => Promise<void>;
	build: () => void;
	populate_node_map: () => void;
}

// --- Per-dict value types (used in tree builders and elsewhere)

type ValueOf<T> = T[keyof T];
export type NodeValues = ValueOf<Project['nodes']>;
export type SourceValues = ValueOf<Project['sources']>;
export type ExposureValues = ValueOf<Project['exposures']>;
export type MetricValues = ValueOf<Project['metrics']>;
export type SemanticModelValues = ValueOf<Project['semantic_models']>;
export type SavedQueryValues = ValueOf<Project['saved_queries']>;
export type MacroValues = ValueOf<Project['macros']>;
export type UnitTestValues = ValueOf<Project['unit_tests']>;

// Tree types

export type TreeNodeType =
	| 'source'
	| 'exposure'
	| 'metric'
	| 'semantic_model'
	| 'saved_query'
	| 'model'
	| 'macro'
	| 'analysis'
	| 'test'
	| 'snapshot'
	| 'seed';

/**
 * Represents a leaf node in a tree.
 *
 * Used for concrete entities such as models, tables, macros,
 * sources, metrics, etc.
 *
 * @typeParam TNode - Underlying domain node type
 */
export type TreeFile<TNode> = {
	/** Discriminator for tree rendering */
	type: 'file' | 'table';

	/** Display name shown in the UI */
	name: string;

	/** Original domain node backing this tree item */
	node: TNode;

	/** Whether this node is currently active/selected */
	active: boolean;

	/** Unique identifier of the underlying node */
	unique_id: string;

	/** Resource type used by the UI layer */
	node_type: TreeNodeType;
};

/**
 * Represents a grouping node in a tree.
 *
 * Folders may represent logical or physical groupings such as
 * packages, directories, databases, schemas, or semantic groups.
 *
 * @typeParam TNode - Underlying domain node type for descendants
 */
export type TreeFolder<TNode> = {
	/** Folder discriminator */
	type: 'folder' | 'database' | 'schema' | 'group';

	/** Folder name shown in the UI */
	name: string;

	/** Whether any descendant node is active */
	active: boolean;

	/** Child folders or files */
	items: TreeItem<TNode>[];
};

/**
 * Discriminated union representing any node in a tree.
 *
 * A TreeItem may be either a folder (with children)
 * or a file (leaf node).
 *
 * @typeParam TNode - Underlying domain node type
 */
export type TreeItem<TNode> = TreeFolder<TNode> | TreeFile<TNode>;
