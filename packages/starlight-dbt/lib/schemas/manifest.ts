import { z } from 'astro/zod';

import { dbtManifestSchema } from './generated/manifest_v12';

/**
 * Zod schema representing the raw dbt manifest v12 JSON structure.
 *
 * Delegates to the generated schema, which validates all fields from the
 * official dbt JSON schema and silently strips unknown fields (strip mode).
 * Version validation is applied separately via `parsedManifestV12Schema`.
 */
export const manifestV12Schema = dbtManifestSchema;

/**
 * Schema that parses and validates a dbt manifest v12, rejecting other versions.
 *
 * Wraps `manifestV12Schema` with a refinement that checks the
 * `metadata.dbt_schema_version` field contains the v12 identifier.
 */
export const parsedManifestV12Schema = dbtManifestSchema.refine(
	(d) => d.metadata.dbt_schema_version?.includes('/manifest/v12.json') ?? false,
	{ message: 'Only dbt manifest v12 is supported' }
);

export type ManifestV12 = z.infer<typeof dbtManifestSchema>;
export type ManifestV12Metadata = ManifestV12['metadata'];
export type ManifestV12Node = ManifestV12['nodes'][string];

// ---------------------------------------------------------------------------
// Per-resource-type node types, derived from the generated schema.
//
// Nodes in the `nodes` dict use a discriminated union with z.literal()
// resource_type values, so Extract<ManifestV12Node, { resource_type: 'X' }>
// produces a precise, narrowed type for each variant.
//
// Nodes in separate top-level dicts (sources, macros, etc.) are typed directly
// via index access, since those dicts are plain records, not discriminated unions.
// ---------------------------------------------------------------------------

// From the `nodes` discriminated union
export type ManifestModelNode = Extract<ManifestV12Node, { resource_type: 'model' }>;
export type ManifestSeedNode = Extract<ManifestV12Node, { resource_type: 'seed' }>;
export type ManifestSnapshotNode = Extract<ManifestV12Node, { resource_type: 'snapshot' }>;
export type ManifestAnalysisNode = Extract<ManifestV12Node, { resource_type: 'analysis' }>;
/** Union of both singular-test and generic-test node shapes. */
export type ManifestTestNode = Extract<ManifestV12Node, { resource_type: 'test' }>;

// From separate top-level dicts
export type ManifestSourceNode = ManifestV12['sources'][string];
export type ManifestMacroNode = ManifestV12['macros'][string];
export type ManifestExposureNode = ManifestV12['exposures'][string];
export type ManifestMetricNode = ManifestV12['metrics'][string];
export type ManifestSemanticModelNode = ManifestV12['semantic_models'][string];
export type ManifestSavedQueryNode = ManifestV12['saved_queries'][string];
export type ManifestUnitTestNode = ManifestV12['unit_tests'][string];

// Derive column type from the generated schema.
// The generated column schema uses .catchall(z.any()), so the inferred type
// includes [k: string]: any, which allows passthrough fields (e.g. custom
// fixture fields like `info`) and avoids cast failures in intersections.
type _ModelNodeForColumns = Extract<ManifestV12['nodes'][string], { resource_type: 'model' }>;
export type ManifestColumnNode = NonNullable<_ModelNodeForColumns['columns']>[string];
