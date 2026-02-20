// This file was generated automatically on 2026-02-18 via `https://github.com/walter9388/starlight-dbt/blob/main/packages/starlight-dbt/scripts/gen_dbt_zod_schemas`
// Tool: json-schema-to-zod@2.7.0
// Source: https://schemas.getdbt.com/dbt/catalog/v1.json

import { z } from 'astro/zod';
export const dbtCatalogSchema = z
	.object({
		metadata: z
			.object({
				dbt_schema_version: z.string().optional(),
				dbt_version: z.string().default('1.10.0a1'),
				generated_at: z.string().optional(),
				invocation_id: z.union([z.string(), z.null()]).optional(),
				invocation_started_at: z.union([z.string(), z.null()]).optional(),
				env: z.record(z.string()).optional(),
			})
			.strict(),
		nodes: z.record(
			z
				.object({
					metadata: z
						.object({
							type: z.string(),
							schema: z.string(),
							name: z.string(),
							database: z.union([z.string(), z.null()]).default(null),
							comment: z.union([z.string(), z.null()]).default(null),
							owner: z.union([z.string(), z.null()]).default(null),
						})
						.strict(),
					columns: z.record(
						z
							.object({
								type: z.string(),
								index: z.number().int(),
								name: z.string(),
								comment: z.union([z.string(), z.null()]).default(null),
							})
							.strict()
					),
					stats: z.record(
						z
							.object({
								id: z.string(),
								label: z.string(),
								value: z.union([z.boolean(), z.string(), z.number(), z.null()]),
								include: z.boolean(),
								description: z.union([z.string(), z.null()]).default(null),
							})
							.strict()
					),
					unique_id: z.union([z.string(), z.null()]).default(null),
				})
				.strict()
		),
		sources: z.record(
			z
				.object({
					metadata: z
						.object({
							type: z.string(),
							schema: z.string(),
							name: z.string(),
							database: z.union([z.string(), z.null()]).default(null),
							comment: z.union([z.string(), z.null()]).default(null),
							owner: z.union([z.string(), z.null()]).default(null),
						})
						.strict(),
					columns: z.record(
						z
							.object({
								type: z.string(),
								index: z.number().int(),
								name: z.string(),
								comment: z.union([z.string(), z.null()]).default(null),
							})
							.strict()
					),
					stats: z.record(
						z
							.object({
								id: z.string(),
								label: z.string(),
								value: z.union([z.boolean(), z.string(), z.number(), z.null()]),
								include: z.boolean(),
								description: z.union([z.string(), z.null()]).default(null),
							})
							.strict()
					),
					unique_id: z.union([z.string(), z.null()]).default(null),
				})
				.strict()
		),
		errors: z.union([z.array(z.string()), z.null()]).default(null),
		_compile_results: z.union([z.any(), z.null()]).default(null),
	})
	.strict();
export type DbtCatalog = z.infer<typeof dbtCatalogSchema>;
