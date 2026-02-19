import type { DbtCatalog, DbtCatalogTable } from '../schemas/catalog';
import type { ManifestColumnNode } from '../schemas/manifest';
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

// ---------------------------------------------------------------------------
// Manifest node interfaces — replaces the former @yu-iskw/dbt-artifacts-parser imports
// ---------------------------------------------------------------------------

/**
 * Represents any node from the manifest `nodes` dict.
 *
 * All location and resource-type-specific fields are declared as optional to
 * accommodate the many resource types (model, seed, snapshot, test, hook, etc.).
 * Extra artifact properties not declared here exist at runtime via the Zod
 * passthrough parser, but are not reflected in this TypeScript type.
 */
export interface ManifestNode {
	unique_id: string;
	name: string;
	resource_type: string;
	package_name: string;
	original_file_path: string;
	fqn: string[];
	description?: string | null;
	tags?: string[];
	docs?: { show?: boolean };
	meta?: Record<string, unknown>;
	columns?: Record<string, ManifestColumnNode>;
	depends_on?: { nodes?: string[]; macros?: string[] };
	/** Human-readable display label — augmented by buildProject. */
	label?: string;
	// Location fields (model, seed, snapshot, source)
	database?: string | null;
	schema?: string | null;
	alias?: string | null;
	identifier?: string | null;
	// Config block (model, seed, snapshot, etc.)
	config?: { materialized?: string };
	// Model-specific
	group?: string | null;
	access?: 'private' | 'protected' | 'public';
	version?: number | string | null;
	raw_code?: string | null;
	compiled_code?: string | null;
	refs?: Array<{ name: string }>;
	// Source-specific
	source_name?: string;
	source_description?: string | null;
	// Exposure-specific
	type?: string;
	// Test-specific
	test_metadata?: {
		name: string;
		namespace?: string | null;
		kwargs?: Record<string, unknown>;
	};
	column_name?: string | null;
	// Macro fields (augmented)
	macro_sql?: string;
	is_adapter_macro?: boolean;
	is_adapter_macro_impl?: boolean;
	impls?: Record<string, string>;
}

export interface ManifestMetadata {
	dbt_schema_version?: string;
	dbt_version?: string;
	generated_at?: string;
	invocation_id?: string | null;
	project_name?: string | null;
	adapter_type?: string | null;
	quoting?: Record<string, unknown> | null;
}

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

// ---------------------------------------------------------------------------
// Augmented types (post-buildProject)
// ---------------------------------------------------------------------------

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
	metadata: ManifestMetadata;
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

// ---------------------------------------------------------------------------
// Catalog types — derived from generated Zod schema (no index signature)
// ---------------------------------------------------------------------------

/**
 * The raw dbt catalog v1 artifact as returned by parseDbtCatalog.
 *
 * Aliased from the generated DbtCatalog type whose .strict() schemas produce
 * no index signature — safe to use in TypeScript intersections without
 * causing AugmentedCatalogArtifact or Project properties to resolve to `never`.
 */
export type CatalogArtifact = DbtCatalog;

export type CatalogMetadata = CatalogArtifact['metadata'];
type CatalogNode = DbtCatalogTable;
type CatalogSource = DbtCatalogTable;

// used after buildProject to represent combined nodes and sources
export type AugmentedCatalogArtifact = CatalogArtifact & {
	nodes: Record<string, CatalogNode | CatalogSource>;
};

// ---------------------------------------------------------------------------
// Combined project type
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Per-dict value types (used in tree builders and elsewhere)
// ---------------------------------------------------------------------------

type ValueOf<T> = T[keyof T];
export type NodeValues = ValueOf<Project['nodes']>;
export type SourceValues = ValueOf<Project['sources']>;
export type ExposureValues = ValueOf<Project['exposures']>;
export type MetricValues = ValueOf<Project['metrics']>;
export type SemanticModelValues = ValueOf<Project['semantic_models']>;
export type SavedQueryValues = ValueOf<Project['saved_queries']>;
export type MacroValues = ValueOf<Project['macros']>;
export type UnitTestValues = ValueOf<Project['unit_tests']>;

// ---------------------------------------------------------------------------
// Tree types
// ---------------------------------------------------------------------------

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
