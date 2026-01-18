import type { CatalogArtifactV1 } from '@yu-iskw/dbt-artifacts-parser/dist/catalog';
import type {
	WritableManifest,
	Seed,
	Analysis,
	SingularTest,
	HookNode,
	Model,
	SqlOperation,
	GenericTest,
	Snapshot,
	Function,
} from '@yu-iskw/dbt-artifacts-parser/dist/manifest';

/**
 * Input accepted by artifact loaders.
 *
 * - A parsed JSON object
 * - A file path pointing to a JSON file
 */
export type JsonInput = string | Record<string, unknown>;

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

export type ManifestArtifact = WritableManifest;
export type ManifestMetadata = ManifestArtifact['metadata'];
export type ManifestNode = ManifestArtifact['nodes'][string] & { label?: string };
type ManifestSource = ManifestArtifact['sources'][string] & { label?: string };
type ManifestExposure = ManifestArtifact['exposures'][string];
type ManifestMetric = ManifestArtifact['metrics'][string];
type ManifestSemanticModel = ManifestArtifact['semantic_models'][string];
type ManifestSavedQuery = ManifestArtifact['saved_queries'][string];
type ManifestUnitTest = ManifestArtifact['unit_tests'][string] & { label?: string };
type ManifestMacros = ManifestArtifact['macros'];
// type ManifestSeed = Extract<ManifestArtifact['nodes'][string], { resource_type: 'seed' }>;
// type ManifestAnalysis = Extract<ManifestArtifact['nodes'][string], { resource_type: 'analysis' }>;
// type ManifestSingularTest = Extract<ManifestArtifact['nodes'][string], { resource_type: 'test' }>;
// type ManifestHookNode = Extract<ManifestArtifact['nodes'][string], { resource_type: 'hooknode' }>;
// type ManifestModel = Extract<ManifestArtifact['nodes'][string], { resource_type: 'model' }>;
// type ManifestSqlOperation = Extract<
// 	ManifestArtifact['nodes'][string],
// 	{ resource_type: 'sqloperation' }
// >;
// type ManifestGenericTest = Extract<
// 	ManifestArtifact['nodes'][string],
// 	{ resource_type: 'generictest' }
// >;
// type ManifestSnapshot = Extract<ManifestArtifact['nodes'][string], { resource_type: 'snapshot' }>;
// type ManifestFunction = Extract<ManifestArtifact['nodes'][string], { resource_type: 'function' }>;
export type AugmentedMacro = ManifestMacros[string] & {
	impls?: Record<string, string>;
	is_adapter_macro?: boolean;
	is_adapter_macro_impl?: boolean;
};
export type AugmentedMacros = {
	[k: string]: AugmentedMacro;
};

type ManifestColumns = ManifestNode['columns'];
// type AugmentedColumns = ManifestColumns extends object
// 	? { [K in keyof ManifestColumns]: ManifestColumns[K] & { tests?: TestInfo[] } }
// 	: never;

type NonEmptyManifestColumns = NonNullable<ManifestColumns>;
type AugmentedColumns = {
	[K in keyof NonEmptyManifestColumns]: NonEmptyManifestColumns[K] & { tests?: TestInfo[] };
};
export type AugmentedColumnNode = Omit<ManifestNode, 'columns'> & {
	columns?: AugmentedColumns;
};

// used after loadProject to represent combined nodes and sources
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

export type CatalogArtifact = CatalogArtifactV1;
export type CatalogMetadata = CatalogArtifact['metadata'];
type CatalogNode = CatalogArtifact['nodes'][string];
type CatalogSource = CatalogArtifact['sources'][string];
// used after loadProject to represent combined nodes and sources
export type AugmentedCatalogArtifact = CatalogArtifact & {
	nodes: Record<string, CatalogNode | CatalogSource>;
};

export type Project = AugmentedManifestArtifact &
	AugmentedCatalogArtifact & { searchable?: (AugmentedColumnNode | AugmentedMacros[string])[] };

export type ProjectNode =
	| Seed
	| Analysis
	| SingularTest
	| HookNode
	| Model
	| SqlOperation
	| GenericTest
	| Snapshot
	| Function
	| AugmentedColumnNode
	| ManifestSource
	| ManifestExposure
	| ManifestMetric
	| ManifestSemanticModel
	| ManifestSavedQuery
	| ManifestUnitTest
	| CatalogNode
	| CatalogSource;

export type FilterProjectNode =
	| Extract<
			ProjectNode,
			{
				resource_type:
					| 'snapshot'
					| 'source'
					| 'seed'
					| 'model'
					| 'analysis'
					| 'exposure'
					| 'metric'
					| 'semantic_model'
					| 'saved_query';
			}
	  >
	| SingularTest;

export interface dbtData {
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
	};
	files: {
		manifest: AugmentedManifestArtifact;
		catalog: AugmentedCatalogArtifact;
	};
	loaded: boolean;
	init: () => Promise<void>;
}
type ValueOf<T> = T[keyof T];
export type NodeValues = ValueOf<Project['nodes']>;
export type SourceValues = ValueOf<Project['sources']>;
export type ExposureValues = ValueOf<Project['exposures']>;
export type MetricValues = ValueOf<Project['metrics']>;
export type SemanticModelValues = ValueOf<Project['semantic_models']>;
export type SavedQueryValues = ValueOf<Project['saved_queries']>;
export type MacroValues = ValueOf<Project['macros']>;

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
