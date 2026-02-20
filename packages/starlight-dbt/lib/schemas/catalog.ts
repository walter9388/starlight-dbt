import { z } from 'astro/zod';

/**
 * Schema for a single column entry in a catalog table.
 */
export const catalogColumnSchema = z.object({
	type: z.string(),
	index: z.number(),
	name: z.string(),
	comment: z.string().nullable().optional(),
});

/**
 * Schema for a single statistics entry attached to a catalog table.
 */
export const catalogStatsSchema = z.object({
	id: z.string(),
	label: z.string(),
	value: z.union([z.boolean(), z.string(), z.number(), z.null()]),
	include: z.boolean(),
	description: z.string().nullable().optional(),
});

/**
 * Schema for a catalog table or source entry, containing metadata,
 * column definitions, and statistics.
 */
export const catalogTableSchema = z.object({
	metadata: z.object({
		type: z.string(),
		schema: z.string(),
		name: z.string(),
		database: z.string().nullable().optional(),
		comment: z.string().nullable().optional(),
		owner: z.string().nullable().optional(),
	}),
	columns: z.record(catalogColumnSchema),
	stats: z.record(catalogStatsSchema),
	unique_id: z.string().nullable().optional(),
});

/**
 * Zod schema for dbt catalog v1 metadata block.
 */
const catalogMetadataSchema = z
	.object({
		dbt_schema_version: z.string().optional(),
		dbt_version: z.string().optional(),
		generated_at: z.string().optional(),
		invocation_id: z.string().nullable().optional(),
		invocation_started_at: z.string().nullable().optional(),
		env: z.record(z.string()).optional(),
	})
	.passthrough();

/**
 * Zod schema representing the raw dbt catalog v1 JSON structure.
 *
 * Version validation is applied separately via `parsedCatalogV1Schema`.
 */
export const catalogV1Schema = z
	.object({
		metadata: catalogMetadataSchema,
		nodes: z.record(catalogTableSchema),
		sources: z.record(catalogTableSchema),
		errors: z.array(z.string()).nullable().optional(),
	})
	.passthrough();

/**
 * Schema that parses and validates a dbt catalog v1, rejecting other versions.
 *
 * Wraps `catalogV1Schema` with a refinement that checks the
 * `metadata.dbt_schema_version` field contains the v1 identifier.
 */
export const parsedCatalogV1Schema = catalogV1Schema.refine(
	(d) => d.metadata.dbt_schema_version?.includes('/catalog/v1.json') ?? false,
	{ message: 'Only dbt catalog v1 is supported' }
);

export type CatalogV1 = z.infer<typeof catalogV1Schema>;
export type CatalogV1Metadata = CatalogV1['metadata'];
export type CatalogV1Table = z.infer<typeof catalogTableSchema>;
export type CatalogV1Column = z.infer<typeof catalogColumnSchema>;
export type CatalogV1Stats = z.infer<typeof catalogStatsSchema>;

// Re-export generated catalog types for use in types.ts.
// DbtCatalog is inferred from .strict() schemas so it has no index signature
// — safe to use in TypeScript intersections without producing `never`.
export type { DbtCatalog } from './generated/catalog_v1';
export type DbtCatalogTable = import('./generated/catalog_v1').DbtCatalog['nodes'][string];
