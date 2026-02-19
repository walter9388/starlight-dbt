import { z } from 'astro/zod';

// ---------------------------------------------------------------------------
// Shared sub-schemas
// ---------------------------------------------------------------------------

/**
 * Schema for a test attached to a column, augmented by buildProject.
 */
const testInfoSchema = z.object({
	test_name: z.string().optional(),
	short: z.string().optional(),
	label: z.string().optional(),
	fk_field: z.string().optional(),
	fk_model: z.unknown().optional(),
});

/**
 * Schema for a column entry with attached tests (post-buildProject augmentation).
 */
const augmentedColumnSchema = z
	.object({
		name: z.string(),
		description: z.string().optional(),
		data_type: z.string().nullable().optional(),
		meta: z.record(z.unknown()).optional(),
		tags: z.array(z.string()).optional(),
		tests: z.array(testInfoSchema).optional(),
	})
	.passthrough();

const columnsSchema = z.record(augmentedColumnSchema).optional();

/** Fields shared across all node types in the collection. */
const baseFields = {
	unique_id: z.string(),
	name: z.string(),
	package_name: z.string(),
	original_file_path: z.string(),
	description: z.string().optional(),
	tags: z.array(z.string()).optional(),
	docs: z.object({ show: z.boolean().optional() }).passthrough().optional(),
	meta: z.record(z.unknown()).optional(),
	/** Human-readable display label — augmented by buildProject. */
	label: z.string().optional(),
};

// ---------------------------------------------------------------------------
// Per-resource-type node schemas
// ---------------------------------------------------------------------------

/**
 * Schema for model nodes (resource_type: 'model').
 */
export const collectionModelNodeSchema = z
	.object({
		...baseFields,
		resource_type: z.literal('model'),
		database: z.string().nullable().optional(),
		schema: z.string().optional(),
		alias: z.string().optional(),
		identifier: z.string().optional(),
		group: z.string().nullable().optional(),
		access: z.enum(['private', 'protected', 'public']).optional(),
		version: z.union([z.number(), z.string()]).nullable().optional(),
		config: z.object({ materialized: z.string().optional() }).passthrough().optional(),
		columns: columnsSchema,
		raw_code: z.string().nullable().optional(),
		compiled_code: z.string().nullable().optional(),
		refs: z.array(z.object({ name: z.string() }).passthrough()).optional(),
		depends_on: z
			.object({ nodes: z.array(z.string()).optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();

/**
 * Schema for seed nodes (resource_type: 'seed').
 */
export const collectionSeedNodeSchema = z
	.object({
		...baseFields,
		resource_type: z.literal('seed'),
		database: z.string().nullable().optional(),
		schema: z.string().optional(),
		alias: z.string().optional(),
		identifier: z.string().optional(),
		config: z.object({ materialized: z.string().optional() }).passthrough().optional(),
		columns: columnsSchema,
	})
	.passthrough();

/**
 * Schema for analysis nodes (resource_type: 'analysis').
 */
export const collectionAnalysisNodeSchema = z
	.object({
		...baseFields,
		resource_type: z.literal('analysis'),
		columns: columnsSchema,
		raw_code: z.string().nullable().optional(),
		compiled_code: z.string().nullable().optional(),
	})
	.passthrough();

/**
 * Schema for snapshot nodes (resource_type: 'snapshot').
 */
export const collectionSnapshotNodeSchema = z
	.object({
		...baseFields,
		resource_type: z.literal('snapshot'),
		database: z.string().nullable().optional(),
		schema: z.string().optional(),
		alias: z.string().optional(),
		identifier: z.string().optional(),
		config: z.object({ materialized: z.string().optional() }).passthrough().optional(),
		columns: columnsSchema,
		raw_code: z.string().nullable().optional(),
		compiled_code: z.string().nullable().optional(),
	})
	.passthrough();

/**
 * Schema for source nodes (resource_type: 'source').
 *
 * Sources have a `source_name` field used for tree grouping.
 */
export const collectionSourceNodeSchema = z
	.object({
		...baseFields,
		resource_type: z.literal('source'),
		source_name: z.string(),
		source_description: z.string().optional(),
		database: z.string().nullable().optional(),
		schema: z.string().optional(),
		identifier: z.string().optional(),
		columns: columnsSchema,
		loader: z.string().optional(),
	})
	.passthrough();

/**
 * Schema for exposure nodes (resource_type: 'exposure').
 *
 * Exposures have a `type` field (e.g., 'dashboard', 'report') used for grouping.
 */
export const collectionExposureNodeSchema = z
	.object({
		...baseFields,
		resource_type: z.literal('exposure'),
		type: z.string().optional(),
		owner: z.record(z.unknown()).optional(),
		refs: z.array(z.object({ name: z.string() }).passthrough()).optional(),
		depends_on: z
			.object({ nodes: z.array(z.string()).optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();

/**
 * Schema for metric nodes (resource_type: 'metric').
 */
export const collectionMetricNodeSchema = z
	.object({
		...baseFields,
		resource_type: z.literal('metric'),
	})
	.passthrough();

/**
 * Schema for semantic model nodes (resource_type: 'semantic_model').
 */
export const collectionSemanticModelNodeSchema = z
	.object({
		...baseFields,
		resource_type: z.literal('semantic_model'),
	})
	.passthrough();

/**
 * Schema for saved query nodes (resource_type: 'saved_query').
 */
export const collectionSavedQueryNodeSchema = z
	.object({
		...baseFields,
		resource_type: z.literal('saved_query'),
	})
	.passthrough();

/**
 * Schema for unit test nodes (resource_type: 'unit_test').
 */
export const collectionUnitTestNodeSchema = z
	.object({
		...baseFields,
		resource_type: z.literal('unit_test'),
		model: z.string().optional(),
	})
	.passthrough();

/**
 * Schema for macro nodes (resource_type: 'macro').
 *
 * Macros include augmented fields (`impls`, `is_adapter_macro`) from buildProject.
 */
export const collectionMacroNodeSchema = z
	.object({
		...baseFields,
		resource_type: z.literal('macro'),
		macro_sql: z.string().optional(),
		arguments: z.array(z.unknown()).optional(),
		/** Consolidated SQL implementations keyed by adapter name — augmented by buildProject. */
		impls: z.record(z.string()).optional(),
		/** True if this macro dispatches to adapter-specific implementations. */
		is_adapter_macro: z.boolean().optional(),
		/** True if this macro is an adapter-specific implementation (e.g. postgres__my_macro). */
		is_adapter_macro_impl: z.boolean().optional(),
	})
	.passthrough();

/**
 * Schema for singular test nodes (resource_type: 'test').
 *
 * Singular tests are custom SQL files without generic test metadata.
 */
export const collectionSingularTestNodeSchema = z
	.object({
		...baseFields,
		resource_type: z.literal('test'),
		column_name: z.string().nullable().optional(),
		depends_on: z
			.object({ nodes: z.array(z.string()).optional() })
			.passthrough()
			.optional(),
	})
	.passthrough();

// ---------------------------------------------------------------------------
// Collection entry schema
// ---------------------------------------------------------------------------

/**
 * Discriminated union of all possible dbt node types in the content collection.
 *
 * Discriminates on the `resource_type` field within the `node` object.
 */
export const dbtCollectionNodeSchema = z.discriminatedUnion('resource_type', [
	collectionModelNodeSchema,
	collectionSeedNodeSchema,
	collectionAnalysisNodeSchema,
	collectionSnapshotNodeSchema,
	collectionSourceNodeSchema,
	collectionExposureNodeSchema,
	collectionMetricNodeSchema,
	collectionSemanticModelNodeSchema,
	collectionSavedQueryNodeSchema,
	collectionUnitTestNodeSchema,
	collectionMacroNodeSchema,
	collectionSingularTestNodeSchema,
]);

/**
 * Zod schema for a single dbt content collection entry.
 *
 * Each entry corresponds to a `TreeFile` node from the dbt service, enriched
 * with the originating project name. Using this schema in `defineCollection`
 * enables fully typed access via `getCollection('dbt')`.
 *
 * @returns - `type` — Whether the node appears as a file or database table
 * @returns - `name` — Display name shown in the sidebar
 * @returns - `node` — The underlying dbt artifact node (discriminated by `resource_type`)
 * @returns - `active` — Whether this node is currently selected
 * @returns - `unique_id` — Unique identifier of the underlying dbt node
 * @returns - `node_type` — Resource type used by the UI layer
 * @returns - `_projectName` — Slug of the dbt project this node belongs to
 */
export const dbtCollectionSchema = z.object({
	type: z.enum(['file', 'table']),
	name: z.string(),
	node: dbtCollectionNodeSchema,
	active: z.boolean(),
	unique_id: z.string(),
	node_type: z.enum([
		'source',
		'exposure',
		'metric',
		'semantic_model',
		'saved_query',
		'model',
		'macro',
		'analysis',
		'test',
		'snapshot',
		'seed',
	]),
	_projectName: z.string(),
});

export type DbtCollectionEntry = z.infer<typeof dbtCollectionSchema>;
export type DbtCollectionNode = z.infer<typeof dbtCollectionNodeSchema>;

// Individual node types
export type CollectionModelNode = z.infer<typeof collectionModelNodeSchema>;
export type CollectionSeedNode = z.infer<typeof collectionSeedNodeSchema>;
export type CollectionAnalysisNode = z.infer<typeof collectionAnalysisNodeSchema>;
export type CollectionSnapshotNode = z.infer<typeof collectionSnapshotNodeSchema>;
export type CollectionSourceNode = z.infer<typeof collectionSourceNodeSchema>;
export type CollectionExposureNode = z.infer<typeof collectionExposureNodeSchema>;
export type CollectionMetricNode = z.infer<typeof collectionMetricNodeSchema>;
export type CollectionSemanticModelNode = z.infer<typeof collectionSemanticModelNodeSchema>;
export type CollectionSavedQueryNode = z.infer<typeof collectionSavedQueryNodeSchema>;
export type CollectionUnitTestNode = z.infer<typeof collectionUnitTestNodeSchema>;
export type CollectionMacroNode = z.infer<typeof collectionMacroNodeSchema>;
export type CollectionSingularTestNode = z.infer<typeof collectionSingularTestNodeSchema>;
