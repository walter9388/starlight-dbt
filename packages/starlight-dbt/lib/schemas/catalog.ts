import { dbtCatalogSchema } from './generated/catalog_v1';

// Re-export generated catalog types — DbtCatalog has no index signature,
// making it safe for TypeScript intersections without producing `never`.
export type { DbtCatalog } from './generated/catalog_v1';
export type DbtCatalogTable = import('./generated/catalog_v1').DbtCatalog['nodes'][string];

/**
 * Zod schema representing the raw dbt catalog v1 JSON structure.
 *
 * Delegates to the generated schema, which validates all fields from the
 * official dbt JSON schema and silently strips unknown fields (strip mode).
 * Version validation is applied separately via `parsedCatalogV1Schema`.
 */
export const catalogV1Schema = dbtCatalogSchema;

/**
 * Schema that parses and validates a dbt catalog v1, rejecting other versions.
 *
 * Wraps `catalogV1Schema` with a refinement that checks the
 * `metadata.dbt_schema_version` field contains the v1 identifier.
 */
export const parsedCatalogV1Schema = dbtCatalogSchema.refine(
	(d) => d.metadata.dbt_schema_version?.includes('/catalog/v1.json') ?? false,
	{ message: 'Only dbt catalog v1 is supported' }
);
