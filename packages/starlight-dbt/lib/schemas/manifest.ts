import { z } from 'astro/zod';

/**
 * Schema for a single column entry within a manifest node.
 */
const columnInfoSchema = z
	.object({
		name: z.string(),
		description: z.string().optional(),
		data_type: z.string().nullable().optional(),
		meta: z.record(z.unknown()).optional(),
		tags: z.array(z.string()).optional(),
		constraints: z.array(z.unknown()).optional(),
	})
	.passthrough();

/**
 * Permissive schema for any node entry in the manifest `nodes` dict.
 *
 * Validates fields that are accessed by the service layer and passes
 * through any additional properties from the raw artifact.
 */
export const baseManifestNodeSchema = z
	.object({
		unique_id: z.string(),
		name: z.string(),
		resource_type: z.string(),
		package_name: z.string(),
		original_file_path: z.string(),
		fqn: z.array(z.string()),
		description: z.string().optional(),
		tags: z.array(z.string()).optional(),
		meta: z.record(z.unknown()).optional(),
		docs: z.object({ show: z.boolean().optional() }).passthrough().optional(),
		columns: z.record(columnInfoSchema).optional(),
		depends_on: z
			.object({
				macros: z.array(z.string()).optional(),
				nodes: z.array(z.string()).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

/**
 * Permissive schema for macro entries in the manifest.
 */
const macroNodeSchema = z
	.object({
		unique_id: z.string(),
		name: z.string(),
		resource_type: z.string(),
		package_name: z.string(),
		original_file_path: z.string(),
	})
	.passthrough();

/**
 * Permissive schema for exposure, metric, semantic model, saved query,
 * and unit test entries — all share the same minimal required fields.
 */
const namedNodeSchema = z
	.object({
		unique_id: z.string(),
		name: z.string(),
	})
	.passthrough();

/**
 * Zod schema for dbt manifest v12 metadata block.
 */
const manifestMetadataSchema = z
	.object({
		dbt_schema_version: z.string().optional(),
		dbt_version: z.string().optional(),
		generated_at: z.string().optional(),
		invocation_id: z.string().nullable().optional(),
		invocation_started_at: z.string().nullable().optional(),
		project_name: z.string().nullable().optional(),
		project_id: z.string().nullable().optional(),
		user_id: z.string().nullable().optional(),
		send_anonymous_usage_stats: z.boolean().nullable().optional(),
		adapter_type: z.string().nullable().optional(),
		quoting: z.record(z.unknown()).nullable().optional(),
		run_started_at: z.string().nullable().optional(),
		env: z.record(z.string()).optional(),
	})
	.passthrough();

/**
 * Zod schema representing the raw dbt manifest v12 JSON structure.
 *
 * This schema is permissive — it validates the fields consumed by the
 * service layer and passes through any additional artifact properties.
 * Version validation is applied separately via `parsedManifestV12Schema`.
 */
export const manifestV12Schema = z
	.object({
		metadata: manifestMetadataSchema,
		nodes: z.record(baseManifestNodeSchema),
		sources: z.record(baseManifestNodeSchema),
		macros: z.record(macroNodeSchema),
		exposures: z.record(
			z
				.object({
					unique_id: z.string(),
					name: z.string(),
					resource_type: z.string(),
				})
				.passthrough()
		),
		metrics: z.record(
			z
				.object({
					unique_id: z.string(),
					name: z.string(),
					resource_type: z.string(),
				})
				.passthrough()
		),
		semantic_models: z.record(namedNodeSchema),
		saved_queries: z.record(namedNodeSchema),
		unit_tests: z.record(namedNodeSchema),
		groups: z.record(z.unknown()).optional(),
		docs: z.record(z.unknown()).optional(),
		selectors: z.record(z.unknown()).optional(),
		disabled: z.record(z.array(z.unknown())).nullable().optional(),
		parent_map: z.record(z.array(z.string())).nullable().optional(),
		child_map: z.record(z.array(z.string())).nullable().optional(),
		group_map: z.record(z.array(z.string())).nullable().optional(),
		functions: z.record(z.unknown()).optional(),
	})
	.passthrough();

/**
 * Schema that parses and validates a dbt manifest v12, rejecting other versions.
 *
 * Wraps `manifestV12Schema` with a refinement that checks the
 * `metadata.dbt_schema_version` field contains the v12 identifier.
 */
export const parsedManifestV12Schema = manifestV12Schema.refine(
	(d) => d.metadata.dbt_schema_version?.includes('/manifest/v12.json') ?? false,
	{ message: 'Only dbt manifest v12 is supported' }
);

export type ManifestV12 = z.infer<typeof manifestV12Schema>;
export type ManifestV12Metadata = ManifestV12['metadata'];
export type ManifestV12Node = z.infer<typeof baseManifestNodeSchema>;

// Derive column type from the generated schema.
// The generated column schema uses .catchall(z.any()), so the inferred type
// includes [k: string]: any, which allows passthrough fields (e.g. custom
// fixture fields like `info`) and avoids cast failures in intersections.
import type { DbtManifest } from './manifest_v12';
type _ModelNode = Extract<DbtManifest['nodes'][string], { resource_type: 'model' }>;
export type ManifestColumnNode = NonNullable<_ModelNode['columns']>[string];
