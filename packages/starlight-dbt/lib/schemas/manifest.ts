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

// Derive column type from the generated schema.
// The generated column schema uses .catchall(z.any()), so the inferred type
// includes [k: string]: any, which allows passthrough fields (e.g. custom
// fixture fields like `info`) and avoids cast failures in intersections.
type _ModelNode = Extract<ManifestV12['nodes'][string], { resource_type: 'model' }>;
export type ManifestColumnNode = NonNullable<_ModelNode['columns']>[string];
