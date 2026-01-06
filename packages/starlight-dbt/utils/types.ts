import type { CatalogArtifactV1 } from '@yu-iskw/dbt-artifacts-parser/dist/catalog';
import type { WritableManifest } from '@yu-iskw/dbt-artifacts-parser/dist/manifest';

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

export interface ProjectService {
	project: Project;
	tree: {
		project: any[];
		database: any[];
		sources: any[];
	};
	files: {
		manifest: AugmentedManifestArtifact;
		catalog: AugmentedCatalogArtifact;
	};
	loaded: boolean;
	init: () => Promise<void>;
}
