// This file was generated automatically on 2026-02-18 via `https://github.com/walter9388/starlight-dbt/blob/main/packages/starlight-dbt/scripts/gen_dbt_zod_schemas`
// Tool: json-schema-to-zod@2.7.0
// Source: https://schemas.getdbt.com/dbt/manifest/v12.json

import { z } from 'astro/zod';
export const dbtManifestSchema = z
	.object({
		/**Metadata about the manifest*/
		metadata: z
			.object({
				dbt_schema_version: z.string().optional(),
				dbt_version: z.string().default('1.10.8'),
				generated_at: z.string().optional(),
				invocation_id: z.union([z.string(), z.null()]).optional(),
				invocation_started_at: z.union([z.string(), z.null()]).optional(),
				env: z.record(z.string()).optional(),
				/**Name of the root project*/
				project_name: z
					.union([z.string(), z.null()])
					.describe('Name of the root project')
					.default(null),
				/**A unique identifier for the project, hashed from the project name*/
				project_id: z
					.union([z.string(), z.null()])
					.describe('A unique identifier for the project, hashed from the project name')
					.default(null),
				/**A unique identifier for the user*/
				user_id: z
					.union([z.string().uuid(), z.null()])
					.describe('A unique identifier for the user')
					.default(null),
				/**Whether dbt is configured to send anonymous usage statistics*/
				send_anonymous_usage_stats: z
					.union([z.boolean(), z.null()])
					.describe('Whether dbt is configured to send anonymous usage statistics')
					.default(null),
				/**The type name of the adapter*/
				adapter_type: z
					.union([z.string(), z.null()])
					.describe('The type name of the adapter')
					.default(null),
				/**The quoting configuration for the project*/
				quoting: z
					.union([
						z
							.object({
								database: z.union([z.boolean(), z.null()]).default(null),
								schema: z.union([z.boolean(), z.null()]).default(null),
								identifier: z.union([z.boolean(), z.null()]).default(null),
								column: z.union([z.boolean(), z.null()]).default(null),
							})
							.strict(),
						z.null(),
					])
					.describe('The quoting configuration for the project')
					.optional(),
			})
			.strict()
			.describe('Metadata about the manifest'),
		/**The nodes defined in the dbt project and its dependencies*/
		nodes: z
			.record(
				z.union([
					z
						.object({
							database: z.union([z.string(), z.null()]),
							schema: z.string(),
							name: z.string(),
							resource_type: z.literal('seed'),
							package_name: z.string(),
							path: z.string(),
							original_file_path: z.string(),
							unique_id: z.string(),
							fqn: z.array(z.string()),
							alias: z.string(),
							checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
							config: z
								.object({
									_extra: z.record(z.any()).optional(),
									enabled: z.boolean().default(true),
									alias: z.union([z.string(), z.null()]).default(null),
									schema: z.union([z.string(), z.null()]).default(null),
									database: z.union([z.string(), z.null()]).default(null),
									tags: z.union([z.array(z.string()), z.string()]).optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									materialized: z.string().default('seed'),
									incremental_strategy: z.union([z.string(), z.null()]).default(null),
									batch_size: z.any().default(null),
									lookback: z.any().default(1),
									begin: z.any().default(null),
									persist_docs: z.record(z.any()).optional(),
									'post-hook': z
										.array(
											z
												.object({
													sql: z.string(),
													transaction: z.boolean().default(true),
													index: z.union([z.number().int(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									'pre-hook': z
										.array(
											z
												.object({
													sql: z.string(),
													transaction: z.boolean().default(true),
													index: z.union([z.number().int(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									quoting: z.record(z.any()).optional(),
									column_types: z.record(z.any()).optional(),
									full_refresh: z.union([z.boolean(), z.null()]).default(null),
									unique_key: z.union([z.string(), z.array(z.string()), z.null()]).default(null),
									on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
									on_configuration_change: z.enum(['apply', 'continue', 'fail']).optional(),
									grants: z.record(z.any()).optional(),
									packages: z.array(z.string()).optional(),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
										})
										.strict()
										.optional(),
									event_time: z.any().default(null),
									concurrent_batches: z.any().default(null),
									delimiter: z.string().default(','),
									quote_columns: z.union([z.boolean(), z.null()]).default(null),
								})
								.catchall(z.any())
								.optional(),
							tags: z.array(z.string()).optional(),
							description: z.string().default(''),
							columns: z
								.record(
									z
										.object({
											name: z.string(),
											description: z.string().default(''),
											meta: z.record(z.any()).optional(),
											data_type: z.union([z.string(), z.null()]).default(null),
											constraints: z
												.array(
													z
														.object({
															type: z.enum([
																'check',
																'not_null',
																'unique',
																'primary_key',
																'foreign_key',
																'custom',
															]),
															name: z.union([z.string(), z.null()]).default(null),
															expression: z.union([z.string(), z.null()]).default(null),
															warn_unenforced: z.boolean().default(true),
															warn_unsupported: z.boolean().default(true),
															to: z.union([z.string(), z.null()]).default(null),
															to_columns: z.array(z.string()).optional(),
														})
														.strict()
												)
												.optional(),
											quote: z.union([z.boolean(), z.null()]).default(null),
											config: z
												.object({
													_extra: z.record(z.any()).optional(),
													meta: z.record(z.any()).optional(),
													tags: z.array(z.string()).optional(),
												})
												.catchall(z.any())
												.optional(),
											tags: z.array(z.string()).optional(),
											_extra: z.record(z.any()).optional(),
											granularity: z
												.union([
													z.enum([
														'nanosecond',
														'microsecond',
														'millisecond',
														'second',
														'minute',
														'hour',
														'day',
														'week',
														'month',
														'quarter',
														'year',
													]),
													z.null(),
												])
												.default(null),
											doc_blocks: z.array(z.string()).optional(),
										})
										.catchall(z.any())
								)
								.optional(),
							meta: z.record(z.any()).optional(),
							group: z.union([z.string(), z.null()]).default(null),
							docs: z
								.object({
									show: z.boolean().default(true),
									node_color: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
							patch_path: z.union([z.string(), z.null()]).default(null),
							build_path: z.union([z.string(), z.null()]).default(null),
							unrendered_config: z.record(z.any()).optional(),
							created_at: z.number().optional(),
							config_call_dict: z.record(z.any()).optional(),
							unrendered_config_call_dict: z.record(z.any()).optional(),
							relation_name: z.union([z.string(), z.null()]).default(null),
							raw_code: z.string().default(''),
							doc_blocks: z.array(z.string()).optional(),
							root_path: z.union([z.string(), z.null()]).default(null),
							depends_on: z
								.object({ macros: z.array(z.string()).optional() })
								.strict()
								.optional(),
							defer_relation: z
								.union([
									z
										.object({
											database: z.union([z.string(), z.null()]),
											schema: z.string(),
											alias: z.string(),
											relation_name: z.union([z.string(), z.null()]),
											resource_type: z.enum([
												'model',
												'analysis',
												'test',
												'snapshot',
												'operation',
												'seed',
												'rpc',
												'sql_operation',
												'doc',
												'source',
												'macro',
												'exposure',
												'metric',
												'group',
												'saved_query',
												'semantic_model',
												'unit_test',
												'fixture',
											]),
											name: z.string(),
											description: z.string(),
											compiled_code: z.union([z.string(), z.null()]),
											meta: z.record(z.any()),
											tags: z.array(z.string()),
											config: z.union([
												z
													.object({
														_extra: z.record(z.any()).optional(),
														enabled: z.boolean().default(true),
														alias: z.union([z.string(), z.null()]).default(null),
														schema: z.union([z.string(), z.null()]).default(null),
														database: z.union([z.string(), z.null()]).default(null),
														tags: z.union([z.array(z.string()), z.string()]).optional(),
														meta: z.record(z.any()).optional(),
														group: z.union([z.string(), z.null()]).default(null),
														materialized: z.string().default('view'),
														incremental_strategy: z.union([z.string(), z.null()]).default(null),
														batch_size: z.any().default(null),
														lookback: z.any().default(1),
														begin: z.any().default(null),
														persist_docs: z.record(z.any()).optional(),
														'post-hook': z
															.array(
																z
																	.object({
																		sql: z.string(),
																		transaction: z.boolean().default(true),
																		index: z.union([z.number().int(), z.null()]).default(null),
																	})
																	.strict()
															)
															.optional(),
														'pre-hook': z
															.array(
																z
																	.object({
																		sql: z.string(),
																		transaction: z.boolean().default(true),
																		index: z.union([z.number().int(), z.null()]).default(null),
																	})
																	.strict()
															)
															.optional(),
														quoting: z.record(z.any()).optional(),
														column_types: z.record(z.any()).optional(),
														full_refresh: z.union([z.boolean(), z.null()]).default(null),
														unique_key: z
															.union([z.string(), z.array(z.string()), z.null()])
															.default(null),
														on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
														on_configuration_change: z
															.enum(['apply', 'continue', 'fail'])
															.optional(),
														grants: z.record(z.any()).optional(),
														packages: z.array(z.string()).optional(),
														docs: z
															.object({
																show: z.boolean().default(true),
																node_color: z.union([z.string(), z.null()]).default(null),
															})
															.strict()
															.optional(),
														contract: z
															.object({
																enforced: z.boolean().default(false),
																alias_types: z.boolean().default(true),
															})
															.strict()
															.optional(),
														event_time: z.any().default(null),
														concurrent_batches: z.any().default(null),
													})
													.catchall(z.any()),
												z.null(),
											]),
										})
										.strict(),
									z.null(),
								])
								.default(null),
						})
						.strict(),
					z
						.object({
							database: z.union([z.string(), z.null()]),
							schema: z.string(),
							name: z.string(),
							resource_type: z.literal('analysis'),
							package_name: z.string(),
							path: z.string(),
							original_file_path: z.string(),
							unique_id: z.string(),
							fqn: z.array(z.string()),
							alias: z.string(),
							checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
							config: z
								.object({
									_extra: z.record(z.any()).optional(),
									enabled: z.boolean().default(true),
									alias: z.union([z.string(), z.null()]).default(null),
									schema: z.union([z.string(), z.null()]).default(null),
									database: z.union([z.string(), z.null()]).default(null),
									tags: z.union([z.array(z.string()), z.string()]).optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									materialized: z.string().default('view'),
									incremental_strategy: z.union([z.string(), z.null()]).default(null),
									batch_size: z.any().default(null),
									lookback: z.any().default(1),
									begin: z.any().default(null),
									persist_docs: z.record(z.any()).optional(),
									'post-hook': z
										.array(
											z
												.object({
													sql: z.string(),
													transaction: z.boolean().default(true),
													index: z.union([z.number().int(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									'pre-hook': z
										.array(
											z
												.object({
													sql: z.string(),
													transaction: z.boolean().default(true),
													index: z.union([z.number().int(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									quoting: z.record(z.any()).optional(),
									column_types: z.record(z.any()).optional(),
									full_refresh: z.union([z.boolean(), z.null()]).default(null),
									unique_key: z.union([z.string(), z.array(z.string()), z.null()]).default(null),
									on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
									on_configuration_change: z.enum(['apply', 'continue', 'fail']).optional(),
									grants: z.record(z.any()).optional(),
									packages: z.array(z.string()).optional(),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
										})
										.strict()
										.optional(),
									event_time: z.any().default(null),
									concurrent_batches: z.any().default(null),
								})
								.catchall(z.any())
								.optional(),
							tags: z.array(z.string()).optional(),
							description: z.string().default(''),
							columns: z
								.record(
									z
										.object({
											name: z.string(),
											description: z.string().default(''),
											meta: z.record(z.any()).optional(),
											data_type: z.union([z.string(), z.null()]).default(null),
											constraints: z
												.array(
													z
														.object({
															type: z.enum([
																'check',
																'not_null',
																'unique',
																'primary_key',
																'foreign_key',
																'custom',
															]),
															name: z.union([z.string(), z.null()]).default(null),
															expression: z.union([z.string(), z.null()]).default(null),
															warn_unenforced: z.boolean().default(true),
															warn_unsupported: z.boolean().default(true),
															to: z.union([z.string(), z.null()]).default(null),
															to_columns: z.array(z.string()).optional(),
														})
														.strict()
												)
												.optional(),
											quote: z.union([z.boolean(), z.null()]).default(null),
											config: z
												.object({
													_extra: z.record(z.any()).optional(),
													meta: z.record(z.any()).optional(),
													tags: z.array(z.string()).optional(),
												})
												.catchall(z.any())
												.optional(),
											tags: z.array(z.string()).optional(),
											_extra: z.record(z.any()).optional(),
											granularity: z
												.union([
													z.enum([
														'nanosecond',
														'microsecond',
														'millisecond',
														'second',
														'minute',
														'hour',
														'day',
														'week',
														'month',
														'quarter',
														'year',
													]),
													z.null(),
												])
												.default(null),
											doc_blocks: z.array(z.string()).optional(),
										})
										.catchall(z.any())
								)
								.optional(),
							meta: z.record(z.any()).optional(),
							group: z.union([z.string(), z.null()]).default(null),
							docs: z
								.object({
									show: z.boolean().default(true),
									node_color: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
							patch_path: z.union([z.string(), z.null()]).default(null),
							build_path: z.union([z.string(), z.null()]).default(null),
							unrendered_config: z.record(z.any()).optional(),
							created_at: z.number().optional(),
							config_call_dict: z.record(z.any()).optional(),
							unrendered_config_call_dict: z.record(z.any()).optional(),
							relation_name: z.union([z.string(), z.null()]).default(null),
							raw_code: z.string().default(''),
							doc_blocks: z.array(z.string()).optional(),
							language: z.string().default('sql'),
							refs: z
								.array(
									z
										.object({
											name: z.string(),
											package: z.union([z.string(), z.null()]).default(null),
											version: z.union([z.string(), z.number(), z.null()]).default(null),
										})
										.strict()
								)
								.optional(),
							sources: z.array(z.array(z.string())).optional(),
							metrics: z.array(z.array(z.string())).optional(),
							depends_on: z
								.object({
									macros: z.array(z.string()).optional(),
									nodes: z.array(z.string()).optional(),
								})
								.strict()
								.optional(),
							compiled_path: z.union([z.string(), z.null()]).default(null),
							compiled: z.boolean().default(false),
							compiled_code: z.union([z.string(), z.null()]).default(null),
							extra_ctes_injected: z.boolean().default(false),
							extra_ctes: z
								.array(z.object({ id: z.string(), sql: z.string() }).strict())
								.optional(),
							_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
							contract: z
								.object({
									enforced: z.boolean().default(false),
									alias_types: z.boolean().default(true),
									checksum: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							database: z.union([z.string(), z.null()]),
							schema: z.string(),
							name: z.string(),
							resource_type: z.literal('test'),
							package_name: z.string(),
							path: z.string(),
							original_file_path: z.string(),
							unique_id: z.string(),
							fqn: z.array(z.string()),
							alias: z.string(),
							checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
							config: z
								.object({
									_extra: z.record(z.any()).optional(),
									enabled: z.boolean().default(true),
									alias: z.union([z.string(), z.null()]).default(null),
									schema: z.union([z.string(), z.null()]).default('dbt_test__audit'),
									database: z.union([z.string(), z.null()]).default(null),
									tags: z.union([z.array(z.string()), z.string()]).optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									materialized: z.string().default('test'),
									severity: z
										.string()
										.regex(new RegExp('^([Ww][Aa][Rr][Nn]|[Ee][Rr][Rr][Oo][Rr])$'))
										.default('ERROR'),
									store_failures: z.union([z.boolean(), z.null()]).default(null),
									store_failures_as: z.union([z.string(), z.null()]).default(null),
									where: z.union([z.string(), z.null()]).default(null),
									limit: z.union([z.number().int(), z.null()]).default(null),
									fail_calc: z.string().default('count(*)'),
									warn_if: z.string().default('!= 0'),
									error_if: z.string().default('!= 0'),
								})
								.catchall(z.any())
								.optional(),
							tags: z.array(z.string()).optional(),
							description: z.string().default(''),
							columns: z
								.record(
									z
										.object({
											name: z.string(),
											description: z.string().default(''),
											meta: z.record(z.any()).optional(),
											data_type: z.union([z.string(), z.null()]).default(null),
											constraints: z
												.array(
													z
														.object({
															type: z.enum([
																'check',
																'not_null',
																'unique',
																'primary_key',
																'foreign_key',
																'custom',
															]),
															name: z.union([z.string(), z.null()]).default(null),
															expression: z.union([z.string(), z.null()]).default(null),
															warn_unenforced: z.boolean().default(true),
															warn_unsupported: z.boolean().default(true),
															to: z.union([z.string(), z.null()]).default(null),
															to_columns: z.array(z.string()).optional(),
														})
														.strict()
												)
												.optional(),
											quote: z.union([z.boolean(), z.null()]).default(null),
											config: z
												.object({
													_extra: z.record(z.any()).optional(),
													meta: z.record(z.any()).optional(),
													tags: z.array(z.string()).optional(),
												})
												.catchall(z.any())
												.optional(),
											tags: z.array(z.string()).optional(),
											_extra: z.record(z.any()).optional(),
											granularity: z
												.union([
													z.enum([
														'nanosecond',
														'microsecond',
														'millisecond',
														'second',
														'minute',
														'hour',
														'day',
														'week',
														'month',
														'quarter',
														'year',
													]),
													z.null(),
												])
												.default(null),
											doc_blocks: z.array(z.string()).optional(),
										})
										.catchall(z.any())
								)
								.optional(),
							meta: z.record(z.any()).optional(),
							group: z.union([z.string(), z.null()]).default(null),
							docs: z
								.object({
									show: z.boolean().default(true),
									node_color: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
							patch_path: z.union([z.string(), z.null()]).default(null),
							build_path: z.union([z.string(), z.null()]).default(null),
							unrendered_config: z.record(z.any()).optional(),
							created_at: z.number().optional(),
							config_call_dict: z.record(z.any()).optional(),
							unrendered_config_call_dict: z.record(z.any()).optional(),
							relation_name: z.union([z.string(), z.null()]).default(null),
							raw_code: z.string().default(''),
							doc_blocks: z.array(z.string()).optional(),
							language: z.string().default('sql'),
							refs: z
								.array(
									z
										.object({
											name: z.string(),
											package: z.union([z.string(), z.null()]).default(null),
											version: z.union([z.string(), z.number(), z.null()]).default(null),
										})
										.strict()
								)
								.optional(),
							sources: z.array(z.array(z.string())).optional(),
							metrics: z.array(z.array(z.string())).optional(),
							depends_on: z
								.object({
									macros: z.array(z.string()).optional(),
									nodes: z.array(z.string()).optional(),
								})
								.strict()
								.optional(),
							compiled_path: z.union([z.string(), z.null()]).default(null),
							compiled: z.boolean().default(false),
							compiled_code: z.union([z.string(), z.null()]).default(null),
							extra_ctes_injected: z.boolean().default(false),
							extra_ctes: z
								.array(z.object({ id: z.string(), sql: z.string() }).strict())
								.optional(),
							_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
							contract: z
								.object({
									enforced: z.boolean().default(false),
									alias_types: z.boolean().default(true),
									checksum: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							database: z.union([z.string(), z.null()]),
							schema: z.string(),
							name: z.string(),
							resource_type: z.literal('operation'),
							package_name: z.string(),
							path: z.string(),
							original_file_path: z.string(),
							unique_id: z.string(),
							fqn: z.array(z.string()),
							alias: z.string(),
							checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
							config: z
								.object({
									_extra: z.record(z.any()).optional(),
									enabled: z.boolean().default(true),
									alias: z.union([z.string(), z.null()]).default(null),
									schema: z.union([z.string(), z.null()]).default(null),
									database: z.union([z.string(), z.null()]).default(null),
									tags: z.union([z.array(z.string()), z.string()]).optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									materialized: z.string().default('view'),
									incremental_strategy: z.union([z.string(), z.null()]).default(null),
									batch_size: z.any().default(null),
									lookback: z.any().default(1),
									begin: z.any().default(null),
									persist_docs: z.record(z.any()).optional(),
									'post-hook': z
										.array(
											z
												.object({
													sql: z.string(),
													transaction: z.boolean().default(true),
													index: z.union([z.number().int(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									'pre-hook': z
										.array(
											z
												.object({
													sql: z.string(),
													transaction: z.boolean().default(true),
													index: z.union([z.number().int(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									quoting: z.record(z.any()).optional(),
									column_types: z.record(z.any()).optional(),
									full_refresh: z.union([z.boolean(), z.null()]).default(null),
									unique_key: z.union([z.string(), z.array(z.string()), z.null()]).default(null),
									on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
									on_configuration_change: z.enum(['apply', 'continue', 'fail']).optional(),
									grants: z.record(z.any()).optional(),
									packages: z.array(z.string()).optional(),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
										})
										.strict()
										.optional(),
									event_time: z.any().default(null),
									concurrent_batches: z.any().default(null),
								})
								.catchall(z.any())
								.optional(),
							tags: z.array(z.string()).optional(),
							description: z.string().default(''),
							columns: z
								.record(
									z
										.object({
											name: z.string(),
											description: z.string().default(''),
											meta: z.record(z.any()).optional(),
											data_type: z.union([z.string(), z.null()]).default(null),
											constraints: z
												.array(
													z
														.object({
															type: z.enum([
																'check',
																'not_null',
																'unique',
																'primary_key',
																'foreign_key',
																'custom',
															]),
															name: z.union([z.string(), z.null()]).default(null),
															expression: z.union([z.string(), z.null()]).default(null),
															warn_unenforced: z.boolean().default(true),
															warn_unsupported: z.boolean().default(true),
															to: z.union([z.string(), z.null()]).default(null),
															to_columns: z.array(z.string()).optional(),
														})
														.strict()
												)
												.optional(),
											quote: z.union([z.boolean(), z.null()]).default(null),
											config: z
												.object({
													_extra: z.record(z.any()).optional(),
													meta: z.record(z.any()).optional(),
													tags: z.array(z.string()).optional(),
												})
												.catchall(z.any())
												.optional(),
											tags: z.array(z.string()).optional(),
											_extra: z.record(z.any()).optional(),
											granularity: z
												.union([
													z.enum([
														'nanosecond',
														'microsecond',
														'millisecond',
														'second',
														'minute',
														'hour',
														'day',
														'week',
														'month',
														'quarter',
														'year',
													]),
													z.null(),
												])
												.default(null),
											doc_blocks: z.array(z.string()).optional(),
										})
										.catchall(z.any())
								)
								.optional(),
							meta: z.record(z.any()).optional(),
							group: z.union([z.string(), z.null()]).default(null),
							docs: z
								.object({
									show: z.boolean().default(true),
									node_color: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
							patch_path: z.union([z.string(), z.null()]).default(null),
							build_path: z.union([z.string(), z.null()]).default(null),
							unrendered_config: z.record(z.any()).optional(),
							created_at: z.number().optional(),
							config_call_dict: z.record(z.any()).optional(),
							unrendered_config_call_dict: z.record(z.any()).optional(),
							relation_name: z.union([z.string(), z.null()]).default(null),
							raw_code: z.string().default(''),
							doc_blocks: z.array(z.string()).optional(),
							language: z.string().default('sql'),
							refs: z
								.array(
									z
										.object({
											name: z.string(),
											package: z.union([z.string(), z.null()]).default(null),
											version: z.union([z.string(), z.number(), z.null()]).default(null),
										})
										.strict()
								)
								.optional(),
							sources: z.array(z.array(z.string())).optional(),
							metrics: z.array(z.array(z.string())).optional(),
							depends_on: z
								.object({
									macros: z.array(z.string()).optional(),
									nodes: z.array(z.string()).optional(),
								})
								.strict()
								.optional(),
							compiled_path: z.union([z.string(), z.null()]).default(null),
							compiled: z.boolean().default(false),
							compiled_code: z.union([z.string(), z.null()]).default(null),
							extra_ctes_injected: z.boolean().default(false),
							extra_ctes: z
								.array(z.object({ id: z.string(), sql: z.string() }).strict())
								.optional(),
							_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
							contract: z
								.object({
									enforced: z.boolean().default(false),
									alias_types: z.boolean().default(true),
									checksum: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
							index: z.union([z.number().int(), z.null()]).default(null),
						})
						.strict(),
					z
						.object({
							database: z.union([z.string(), z.null()]),
							schema: z.string(),
							name: z.string(),
							resource_type: z.literal('model'),
							package_name: z.string(),
							path: z.string(),
							original_file_path: z.string(),
							unique_id: z.string(),
							fqn: z.array(z.string()),
							alias: z.string(),
							checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
							config: z
								.object({
									_extra: z.record(z.any()).optional(),
									enabled: z.boolean().default(true),
									alias: z.union([z.string(), z.null()]).default(null),
									schema: z.union([z.string(), z.null()]).default(null),
									database: z.union([z.string(), z.null()]).default(null),
									tags: z.union([z.array(z.string()), z.string()]).optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									materialized: z.string().default('view'),
									incremental_strategy: z.union([z.string(), z.null()]).default(null),
									batch_size: z.any().default(null),
									lookback: z.any().default(1),
									begin: z.any().default(null),
									persist_docs: z.record(z.any()).optional(),
									'post-hook': z
										.array(
											z
												.object({
													sql: z.string(),
													transaction: z.boolean().default(true),
													index: z.union([z.number().int(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									'pre-hook': z
										.array(
											z
												.object({
													sql: z.string(),
													transaction: z.boolean().default(true),
													index: z.union([z.number().int(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									quoting: z.record(z.any()).optional(),
									column_types: z.record(z.any()).optional(),
									full_refresh: z.union([z.boolean(), z.null()]).default(null),
									unique_key: z.union([z.string(), z.array(z.string()), z.null()]).default(null),
									on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
									on_configuration_change: z.enum(['apply', 'continue', 'fail']).optional(),
									grants: z.record(z.any()).optional(),
									packages: z.array(z.string()).optional(),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
										})
										.strict()
										.optional(),
									event_time: z.any().default(null),
									concurrent_batches: z.any().default(null),
									access: z.enum(['private', 'protected', 'public']).default('protected'),
									freshness: z
										.union([
											z
												.object({
													build_after: z
														.object({
															count: z.number().int(),
															period: z.enum(['minute', 'hour', 'day']),
															updates_on: z.enum(['all', 'any']).default('any'),
														})
														.catchall(z.any()),
												})
												.catchall(z.any()),
											z.null(),
										])
										.default(null),
								})
								.catchall(z.any())
								.optional(),
							tags: z.array(z.string()).optional(),
							description: z.string().default(''),
							columns: z
								.record(
									z
										.object({
											name: z.string(),
											description: z.string().default(''),
											meta: z.record(z.any()).optional(),
											data_type: z.union([z.string(), z.null()]).default(null),
											constraints: z
												.array(
													z
														.object({
															type: z.enum([
																'check',
																'not_null',
																'unique',
																'primary_key',
																'foreign_key',
																'custom',
															]),
															name: z.union([z.string(), z.null()]).default(null),
															expression: z.union([z.string(), z.null()]).default(null),
															warn_unenforced: z.boolean().default(true),
															warn_unsupported: z.boolean().default(true),
															to: z.union([z.string(), z.null()]).default(null),
															to_columns: z.array(z.string()).optional(),
														})
														.strict()
												)
												.optional(),
											quote: z.union([z.boolean(), z.null()]).default(null),
											config: z
												.object({
													_extra: z.record(z.any()).optional(),
													meta: z.record(z.any()).optional(),
													tags: z.array(z.string()).optional(),
												})
												.catchall(z.any())
												.optional(),
											tags: z.array(z.string()).optional(),
											_extra: z.record(z.any()).optional(),
											granularity: z
												.union([
													z.enum([
														'nanosecond',
														'microsecond',
														'millisecond',
														'second',
														'minute',
														'hour',
														'day',
														'week',
														'month',
														'quarter',
														'year',
													]),
													z.null(),
												])
												.default(null),
											doc_blocks: z.array(z.string()).optional(),
										})
										.catchall(z.any())
								)
								.optional(),
							meta: z.record(z.any()).optional(),
							group: z.union([z.string(), z.null()]).default(null),
							docs: z
								.object({
									show: z.boolean().default(true),
									node_color: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
							patch_path: z.union([z.string(), z.null()]).default(null),
							build_path: z.union([z.string(), z.null()]).default(null),
							unrendered_config: z.record(z.any()).optional(),
							created_at: z.number().optional(),
							config_call_dict: z.record(z.any()).optional(),
							unrendered_config_call_dict: z.record(z.any()).optional(),
							relation_name: z.union([z.string(), z.null()]).default(null),
							raw_code: z.string().default(''),
							doc_blocks: z.array(z.string()).optional(),
							language: z.string().default('sql'),
							refs: z
								.array(
									z
										.object({
											name: z.string(),
											package: z.union([z.string(), z.null()]).default(null),
											version: z.union([z.string(), z.number(), z.null()]).default(null),
										})
										.strict()
								)
								.optional(),
							sources: z.array(z.array(z.string())).optional(),
							metrics: z.array(z.array(z.string())).optional(),
							depends_on: z
								.object({
									macros: z.array(z.string()).optional(),
									nodes: z.array(z.string()).optional(),
								})
								.strict()
								.optional(),
							compiled_path: z.union([z.string(), z.null()]).default(null),
							compiled: z.boolean().default(false),
							compiled_code: z.union([z.string(), z.null()]).default(null),
							extra_ctes_injected: z.boolean().default(false),
							extra_ctes: z
								.array(z.object({ id: z.string(), sql: z.string() }).strict())
								.optional(),
							_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
							contract: z
								.object({
									enforced: z.boolean().default(false),
									alias_types: z.boolean().default(true),
									checksum: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
							access: z.enum(['private', 'protected', 'public']).default('protected'),
							constraints: z
								.array(
									z
										.object({
											type: z.enum([
												'check',
												'not_null',
												'unique',
												'primary_key',
												'foreign_key',
												'custom',
											]),
											name: z.union([z.string(), z.null()]).default(null),
											expression: z.union([z.string(), z.null()]).default(null),
											warn_unenforced: z.boolean().default(true),
											warn_unsupported: z.boolean().default(true),
											to: z.union([z.string(), z.null()]).default(null),
											to_columns: z.array(z.string()).optional(),
											columns: z.array(z.string()).optional(),
										})
										.strict()
								)
								.optional(),
							version: z.union([z.string(), z.number(), z.null()]).default(null),
							latest_version: z.union([z.string(), z.number(), z.null()]).default(null),
							deprecation_date: z.union([z.string(), z.null()]).default(null),
							defer_relation: z
								.union([
									z
										.object({
											database: z.union([z.string(), z.null()]),
											schema: z.string(),
											alias: z.string(),
											relation_name: z.union([z.string(), z.null()]),
											resource_type: z.enum([
												'model',
												'analysis',
												'test',
												'snapshot',
												'operation',
												'seed',
												'rpc',
												'sql_operation',
												'doc',
												'source',
												'macro',
												'exposure',
												'metric',
												'group',
												'saved_query',
												'semantic_model',
												'unit_test',
												'fixture',
											]),
											name: z.string(),
											description: z.string(),
											compiled_code: z.union([z.string(), z.null()]),
											meta: z.record(z.any()),
											tags: z.array(z.string()),
											config: z.union([
												z
													.object({
														_extra: z.record(z.any()).optional(),
														enabled: z.boolean().default(true),
														alias: z.union([z.string(), z.null()]).default(null),
														schema: z.union([z.string(), z.null()]).default(null),
														database: z.union([z.string(), z.null()]).default(null),
														tags: z.union([z.array(z.string()), z.string()]).optional(),
														meta: z.record(z.any()).optional(),
														group: z.union([z.string(), z.null()]).default(null),
														materialized: z.string().default('view'),
														incremental_strategy: z.union([z.string(), z.null()]).default(null),
														batch_size: z.any().default(null),
														lookback: z.any().default(1),
														begin: z.any().default(null),
														persist_docs: z.record(z.any()).optional(),
														'post-hook': z
															.array(
																z
																	.object({
																		sql: z.string(),
																		transaction: z.boolean().default(true),
																		index: z.union([z.number().int(), z.null()]).default(null),
																	})
																	.strict()
															)
															.optional(),
														'pre-hook': z
															.array(
																z
																	.object({
																		sql: z.string(),
																		transaction: z.boolean().default(true),
																		index: z.union([z.number().int(), z.null()]).default(null),
																	})
																	.strict()
															)
															.optional(),
														quoting: z.record(z.any()).optional(),
														column_types: z.record(z.any()).optional(),
														full_refresh: z.union([z.boolean(), z.null()]).default(null),
														unique_key: z
															.union([z.string(), z.array(z.string()), z.null()])
															.default(null),
														on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
														on_configuration_change: z
															.enum(['apply', 'continue', 'fail'])
															.optional(),
														grants: z.record(z.any()).optional(),
														packages: z.array(z.string()).optional(),
														docs: z
															.object({
																show: z.boolean().default(true),
																node_color: z.union([z.string(), z.null()]).default(null),
															})
															.strict()
															.optional(),
														contract: z
															.object({
																enforced: z.boolean().default(false),
																alias_types: z.boolean().default(true),
															})
															.strict()
															.optional(),
														event_time: z.any().default(null),
														concurrent_batches: z.any().default(null),
													})
													.catchall(z.any()),
												z.null(),
											]),
										})
										.strict(),
									z.null(),
								])
								.default(null),
							primary_key: z.array(z.string()).optional(),
							time_spine: z
								.union([
									z
										.object({
											standard_granularity_column: z.string(),
											custom_granularities: z
												.array(
													z
														.object({
															name: z.string(),
															column_name: z.union([z.string(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
										})
										.strict(),
									z.null(),
								])
								.default(null),
						})
						.strict(),
					z
						.object({
							database: z.union([z.string(), z.null()]),
							schema: z.string(),
							name: z.string(),
							resource_type: z.literal('sql_operation'),
							package_name: z.string(),
							path: z.string(),
							original_file_path: z.string(),
							unique_id: z.string(),
							fqn: z.array(z.string()),
							alias: z.string(),
							checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
							config: z
								.object({
									_extra: z.record(z.any()).optional(),
									enabled: z.boolean().default(true),
									alias: z.union([z.string(), z.null()]).default(null),
									schema: z.union([z.string(), z.null()]).default(null),
									database: z.union([z.string(), z.null()]).default(null),
									tags: z.union([z.array(z.string()), z.string()]).optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									materialized: z.string().default('view'),
									incremental_strategy: z.union([z.string(), z.null()]).default(null),
									batch_size: z.any().default(null),
									lookback: z.any().default(1),
									begin: z.any().default(null),
									persist_docs: z.record(z.any()).optional(),
									'post-hook': z
										.array(
											z
												.object({
													sql: z.string(),
													transaction: z.boolean().default(true),
													index: z.union([z.number().int(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									'pre-hook': z
										.array(
											z
												.object({
													sql: z.string(),
													transaction: z.boolean().default(true),
													index: z.union([z.number().int(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									quoting: z.record(z.any()).optional(),
									column_types: z.record(z.any()).optional(),
									full_refresh: z.union([z.boolean(), z.null()]).default(null),
									unique_key: z.union([z.string(), z.array(z.string()), z.null()]).default(null),
									on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
									on_configuration_change: z.enum(['apply', 'continue', 'fail']).optional(),
									grants: z.record(z.any()).optional(),
									packages: z.array(z.string()).optional(),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
										})
										.strict()
										.optional(),
									event_time: z.any().default(null),
									concurrent_batches: z.any().default(null),
								})
								.catchall(z.any())
								.optional(),
							tags: z.array(z.string()).optional(),
							description: z.string().default(''),
							columns: z
								.record(
									z
										.object({
											name: z.string(),
											description: z.string().default(''),
											meta: z.record(z.any()).optional(),
											data_type: z.union([z.string(), z.null()]).default(null),
											constraints: z
												.array(
													z
														.object({
															type: z.enum([
																'check',
																'not_null',
																'unique',
																'primary_key',
																'foreign_key',
																'custom',
															]),
															name: z.union([z.string(), z.null()]).default(null),
															expression: z.union([z.string(), z.null()]).default(null),
															warn_unenforced: z.boolean().default(true),
															warn_unsupported: z.boolean().default(true),
															to: z.union([z.string(), z.null()]).default(null),
															to_columns: z.array(z.string()).optional(),
														})
														.strict()
												)
												.optional(),
											quote: z.union([z.boolean(), z.null()]).default(null),
											config: z
												.object({
													_extra: z.record(z.any()).optional(),
													meta: z.record(z.any()).optional(),
													tags: z.array(z.string()).optional(),
												})
												.catchall(z.any())
												.optional(),
											tags: z.array(z.string()).optional(),
											_extra: z.record(z.any()).optional(),
											granularity: z
												.union([
													z.enum([
														'nanosecond',
														'microsecond',
														'millisecond',
														'second',
														'minute',
														'hour',
														'day',
														'week',
														'month',
														'quarter',
														'year',
													]),
													z.null(),
												])
												.default(null),
											doc_blocks: z.array(z.string()).optional(),
										})
										.catchall(z.any())
								)
								.optional(),
							meta: z.record(z.any()).optional(),
							group: z.union([z.string(), z.null()]).default(null),
							docs: z
								.object({
									show: z.boolean().default(true),
									node_color: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
							patch_path: z.union([z.string(), z.null()]).default(null),
							build_path: z.union([z.string(), z.null()]).default(null),
							unrendered_config: z.record(z.any()).optional(),
							created_at: z.number().optional(),
							config_call_dict: z.record(z.any()).optional(),
							unrendered_config_call_dict: z.record(z.any()).optional(),
							relation_name: z.union([z.string(), z.null()]).default(null),
							raw_code: z.string().default(''),
							doc_blocks: z.array(z.string()).optional(),
							language: z.string().default('sql'),
							refs: z
								.array(
									z
										.object({
											name: z.string(),
											package: z.union([z.string(), z.null()]).default(null),
											version: z.union([z.string(), z.number(), z.null()]).default(null),
										})
										.strict()
								)
								.optional(),
							sources: z.array(z.array(z.string())).optional(),
							metrics: z.array(z.array(z.string())).optional(),
							depends_on: z
								.object({
									macros: z.array(z.string()).optional(),
									nodes: z.array(z.string()).optional(),
								})
								.strict()
								.optional(),
							compiled_path: z.union([z.string(), z.null()]).default(null),
							compiled: z.boolean().default(false),
							compiled_code: z.union([z.string(), z.null()]).default(null),
							extra_ctes_injected: z.boolean().default(false),
							extra_ctes: z
								.array(z.object({ id: z.string(), sql: z.string() }).strict())
								.optional(),
							_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
							contract: z
								.object({
									enforced: z.boolean().default(false),
									alias_types: z.boolean().default(true),
									checksum: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							database: z.union([z.string(), z.null()]),
							schema: z.string(),
							name: z.string(),
							resource_type: z.literal('test'),
							package_name: z.string(),
							path: z.string(),
							original_file_path: z.string(),
							unique_id: z.string(),
							fqn: z.array(z.string()),
							alias: z.string(),
							checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
							config: z
								.object({
									_extra: z.record(z.any()).optional(),
									enabled: z.boolean().default(true),
									alias: z.union([z.string(), z.null()]).default(null),
									schema: z.union([z.string(), z.null()]).default('dbt_test__audit'),
									database: z.union([z.string(), z.null()]).default(null),
									tags: z.union([z.array(z.string()), z.string()]).optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									materialized: z.string().default('test'),
									severity: z
										.string()
										.regex(new RegExp('^([Ww][Aa][Rr][Nn]|[Ee][Rr][Rr][Oo][Rr])$'))
										.default('ERROR'),
									store_failures: z.union([z.boolean(), z.null()]).default(null),
									store_failures_as: z.union([z.string(), z.null()]).default(null),
									where: z.union([z.string(), z.null()]).default(null),
									limit: z.union([z.number().int(), z.null()]).default(null),
									fail_calc: z.string().default('count(*)'),
									warn_if: z.string().default('!= 0'),
									error_if: z.string().default('!= 0'),
								})
								.catchall(z.any())
								.optional(),
							tags: z.array(z.string()).optional(),
							description: z.string().default(''),
							columns: z
								.record(
									z
										.object({
											name: z.string(),
											description: z.string().default(''),
											meta: z.record(z.any()).optional(),
											data_type: z.union([z.string(), z.null()]).default(null),
											constraints: z
												.array(
													z
														.object({
															type: z.enum([
																'check',
																'not_null',
																'unique',
																'primary_key',
																'foreign_key',
																'custom',
															]),
															name: z.union([z.string(), z.null()]).default(null),
															expression: z.union([z.string(), z.null()]).default(null),
															warn_unenforced: z.boolean().default(true),
															warn_unsupported: z.boolean().default(true),
															to: z.union([z.string(), z.null()]).default(null),
															to_columns: z.array(z.string()).optional(),
														})
														.strict()
												)
												.optional(),
											quote: z.union([z.boolean(), z.null()]).default(null),
											config: z
												.object({
													_extra: z.record(z.any()).optional(),
													meta: z.record(z.any()).optional(),
													tags: z.array(z.string()).optional(),
												})
												.catchall(z.any())
												.optional(),
											tags: z.array(z.string()).optional(),
											_extra: z.record(z.any()).optional(),
											granularity: z
												.union([
													z.enum([
														'nanosecond',
														'microsecond',
														'millisecond',
														'second',
														'minute',
														'hour',
														'day',
														'week',
														'month',
														'quarter',
														'year',
													]),
													z.null(),
												])
												.default(null),
											doc_blocks: z.array(z.string()).optional(),
										})
										.catchall(z.any())
								)
								.optional(),
							meta: z.record(z.any()).optional(),
							group: z.union([z.string(), z.null()]).default(null),
							docs: z
								.object({
									show: z.boolean().default(true),
									node_color: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
							patch_path: z.union([z.string(), z.null()]).default(null),
							build_path: z.union([z.string(), z.null()]).default(null),
							unrendered_config: z.record(z.any()).optional(),
							created_at: z.number().optional(),
							config_call_dict: z.record(z.any()).optional(),
							unrendered_config_call_dict: z.record(z.any()).optional(),
							relation_name: z.union([z.string(), z.null()]).default(null),
							raw_code: z.string().default(''),
							doc_blocks: z.array(z.string()).optional(),
							language: z.string().default('sql'),
							refs: z
								.array(
									z
										.object({
											name: z.string(),
											package: z.union([z.string(), z.null()]).default(null),
											version: z.union([z.string(), z.number(), z.null()]).default(null),
										})
										.strict()
								)
								.optional(),
							sources: z.array(z.array(z.string())).optional(),
							metrics: z.array(z.array(z.string())).optional(),
							depends_on: z
								.object({
									macros: z.array(z.string()).optional(),
									nodes: z.array(z.string()).optional(),
								})
								.strict()
								.optional(),
							compiled_path: z.union([z.string(), z.null()]).default(null),
							compiled: z.boolean().default(false),
							compiled_code: z.union([z.string(), z.null()]).default(null),
							extra_ctes_injected: z.boolean().default(false),
							extra_ctes: z
								.array(z.object({ id: z.string(), sql: z.string() }).strict())
								.optional(),
							_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
							contract: z
								.object({
									enforced: z.boolean().default(false),
									alias_types: z.boolean().default(true),
									checksum: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
							column_name: z.union([z.string(), z.null()]).default(null),
							file_key_name: z.union([z.string(), z.null()]).default(null),
							attached_node: z.union([z.string(), z.null()]).default(null),
							test_metadata: z
								.object({
									name: z.string().default('test'),
									kwargs: z.record(z.any()).optional(),
									namespace: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
						})
						.strict(),
					z
						.object({
							database: z.union([z.string(), z.null()]),
							schema: z.string(),
							name: z.string(),
							resource_type: z.literal('snapshot'),
							package_name: z.string(),
							path: z.string(),
							original_file_path: z.string(),
							unique_id: z.string(),
							fqn: z.array(z.string()),
							alias: z.string(),
							checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
							config: z
								.object({
									_extra: z.record(z.any()).optional(),
									enabled: z.boolean().default(true),
									alias: z.union([z.string(), z.null()]).default(null),
									schema: z.union([z.string(), z.null()]).default(null),
									database: z.union([z.string(), z.null()]).default(null),
									tags: z.union([z.array(z.string()), z.string()]).optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									materialized: z.string().default('snapshot'),
									incremental_strategy: z.union([z.string(), z.null()]).default(null),
									batch_size: z.any().default(null),
									lookback: z.any().default(1),
									begin: z.any().default(null),
									persist_docs: z.record(z.any()).optional(),
									'post-hook': z
										.array(
											z
												.object({
													sql: z.string(),
													transaction: z.boolean().default(true),
													index: z.union([z.number().int(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									'pre-hook': z
										.array(
											z
												.object({
													sql: z.string(),
													transaction: z.boolean().default(true),
													index: z.union([z.number().int(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									quoting: z.record(z.any()).optional(),
									column_types: z.record(z.any()).optional(),
									full_refresh: z.union([z.boolean(), z.null()]).default(null),
									unique_key: z.union([z.string(), z.array(z.string()), z.null()]).default(null),
									on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
									on_configuration_change: z.enum(['apply', 'continue', 'fail']).optional(),
									grants: z.record(z.any()).optional(),
									packages: z.array(z.string()).optional(),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
										})
										.strict()
										.optional(),
									event_time: z.any().default(null),
									concurrent_batches: z.any().default(null),
									strategy: z.union([z.string(), z.null()]).default(null),
									target_schema: z.union([z.string(), z.null()]).default(null),
									target_database: z.union([z.string(), z.null()]).default(null),
									updated_at: z.union([z.string(), z.null()]).default(null),
									check_cols: z.union([z.string(), z.array(z.string()), z.null()]).default(null),
									snapshot_meta_column_names: z
										.object({
											dbt_valid_to: z.union([z.string(), z.null()]).default(null),
											dbt_valid_from: z.union([z.string(), z.null()]).default(null),
											dbt_scd_id: z.union([z.string(), z.null()]).default(null),
											dbt_updated_at: z.union([z.string(), z.null()]).default(null),
											dbt_is_deleted: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									dbt_valid_to_current: z.union([z.string(), z.null()]).default(null),
								})
								.catchall(z.any()),
							tags: z.array(z.string()).optional(),
							description: z.string().default(''),
							columns: z
								.record(
									z
										.object({
											name: z.string(),
											description: z.string().default(''),
											meta: z.record(z.any()).optional(),
											data_type: z.union([z.string(), z.null()]).default(null),
											constraints: z
												.array(
													z
														.object({
															type: z.enum([
																'check',
																'not_null',
																'unique',
																'primary_key',
																'foreign_key',
																'custom',
															]),
															name: z.union([z.string(), z.null()]).default(null),
															expression: z.union([z.string(), z.null()]).default(null),
															warn_unenforced: z.boolean().default(true),
															warn_unsupported: z.boolean().default(true),
															to: z.union([z.string(), z.null()]).default(null),
															to_columns: z.array(z.string()).optional(),
														})
														.strict()
												)
												.optional(),
											quote: z.union([z.boolean(), z.null()]).default(null),
											config: z
												.object({
													_extra: z.record(z.any()).optional(),
													meta: z.record(z.any()).optional(),
													tags: z.array(z.string()).optional(),
												})
												.catchall(z.any())
												.optional(),
											tags: z.array(z.string()).optional(),
											_extra: z.record(z.any()).optional(),
											granularity: z
												.union([
													z.enum([
														'nanosecond',
														'microsecond',
														'millisecond',
														'second',
														'minute',
														'hour',
														'day',
														'week',
														'month',
														'quarter',
														'year',
													]),
													z.null(),
												])
												.default(null),
											doc_blocks: z.array(z.string()).optional(),
										})
										.catchall(z.any())
								)
								.optional(),
							meta: z.record(z.any()).optional(),
							group: z.union([z.string(), z.null()]).default(null),
							docs: z
								.object({
									show: z.boolean().default(true),
									node_color: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
							patch_path: z.union([z.string(), z.null()]).default(null),
							build_path: z.union([z.string(), z.null()]).default(null),
							unrendered_config: z.record(z.any()).optional(),
							created_at: z.number().optional(),
							config_call_dict: z.record(z.any()).optional(),
							unrendered_config_call_dict: z.record(z.any()).optional(),
							relation_name: z.union([z.string(), z.null()]).default(null),
							raw_code: z.string().default(''),
							doc_blocks: z.array(z.string()).optional(),
							language: z.string().default('sql'),
							refs: z
								.array(
									z
										.object({
											name: z.string(),
											package: z.union([z.string(), z.null()]).default(null),
											version: z.union([z.string(), z.number(), z.null()]).default(null),
										})
										.strict()
								)
								.optional(),
							sources: z.array(z.array(z.string())).optional(),
							metrics: z.array(z.array(z.string())).optional(),
							depends_on: z
								.object({
									macros: z.array(z.string()).optional(),
									nodes: z.array(z.string()).optional(),
								})
								.strict()
								.optional(),
							compiled_path: z.union([z.string(), z.null()]).default(null),
							compiled: z.boolean().default(false),
							compiled_code: z.union([z.string(), z.null()]).default(null),
							extra_ctes_injected: z.boolean().default(false),
							extra_ctes: z
								.array(z.object({ id: z.string(), sql: z.string() }).strict())
								.optional(),
							_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
							contract: z
								.object({
									enforced: z.boolean().default(false),
									alias_types: z.boolean().default(true),
									checksum: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
								.optional(),
							defer_relation: z
								.union([
									z
										.object({
											database: z.union([z.string(), z.null()]),
											schema: z.string(),
											alias: z.string(),
											relation_name: z.union([z.string(), z.null()]),
											resource_type: z.enum([
												'model',
												'analysis',
												'test',
												'snapshot',
												'operation',
												'seed',
												'rpc',
												'sql_operation',
												'doc',
												'source',
												'macro',
												'exposure',
												'metric',
												'group',
												'saved_query',
												'semantic_model',
												'unit_test',
												'fixture',
											]),
											name: z.string(),
											description: z.string(),
											compiled_code: z.union([z.string(), z.null()]),
											meta: z.record(z.any()),
											tags: z.array(z.string()),
											config: z.union([
												z
													.object({
														_extra: z.record(z.any()).optional(),
														enabled: z.boolean().default(true),
														alias: z.union([z.string(), z.null()]).default(null),
														schema: z.union([z.string(), z.null()]).default(null),
														database: z.union([z.string(), z.null()]).default(null),
														tags: z.union([z.array(z.string()), z.string()]).optional(),
														meta: z.record(z.any()).optional(),
														group: z.union([z.string(), z.null()]).default(null),
														materialized: z.string().default('view'),
														incremental_strategy: z.union([z.string(), z.null()]).default(null),
														batch_size: z.any().default(null),
														lookback: z.any().default(1),
														begin: z.any().default(null),
														persist_docs: z.record(z.any()).optional(),
														'post-hook': z
															.array(
																z
																	.object({
																		sql: z.string(),
																		transaction: z.boolean().default(true),
																		index: z.union([z.number().int(), z.null()]).default(null),
																	})
																	.strict()
															)
															.optional(),
														'pre-hook': z
															.array(
																z
																	.object({
																		sql: z.string(),
																		transaction: z.boolean().default(true),
																		index: z.union([z.number().int(), z.null()]).default(null),
																	})
																	.strict()
															)
															.optional(),
														quoting: z.record(z.any()).optional(),
														column_types: z.record(z.any()).optional(),
														full_refresh: z.union([z.boolean(), z.null()]).default(null),
														unique_key: z
															.union([z.string(), z.array(z.string()), z.null()])
															.default(null),
														on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
														on_configuration_change: z
															.enum(['apply', 'continue', 'fail'])
															.optional(),
														grants: z.record(z.any()).optional(),
														packages: z.array(z.string()).optional(),
														docs: z
															.object({
																show: z.boolean().default(true),
																node_color: z.union([z.string(), z.null()]).default(null),
															})
															.strict()
															.optional(),
														contract: z
															.object({
																enforced: z.boolean().default(false),
																alias_types: z.boolean().default(true),
															})
															.strict()
															.optional(),
														event_time: z.any().default(null),
														concurrent_batches: z.any().default(null),
													})
													.catchall(z.any()),
												z.null(),
											]),
										})
										.strict(),
									z.null(),
								])
								.default(null),
						})
						.strict(),
				])
			)
			.describe('The nodes defined in the dbt project and its dependencies'),
		/**The sources defined in the dbt project and its dependencies*/
		sources: z
			.record(
				z
					.object({
						database: z.union([z.string(), z.null()]),
						schema: z.string(),
						name: z.string(),
						resource_type: z.literal('source'),
						package_name: z.string(),
						path: z.string(),
						original_file_path: z.string(),
						unique_id: z.string(),
						fqn: z.array(z.string()),
						source_name: z.string(),
						source_description: z.string(),
						loader: z.string(),
						identifier: z.string(),
						quoting: z
							.object({
								database: z.union([z.boolean(), z.null()]).default(null),
								schema: z.union([z.boolean(), z.null()]).default(null),
								identifier: z.union([z.boolean(), z.null()]).default(null),
								column: z.union([z.boolean(), z.null()]).default(null),
							})
							.strict()
							.optional(),
						loaded_at_field: z.union([z.string(), z.null()]).default(null),
						loaded_at_query: z.union([z.string(), z.null()]).default(null),
						freshness: z
							.union([
								z
									.object({
										warn_after: z
											.union([
												z
													.object({
														count: z.union([z.number().int(), z.null()]).default(null),
														period: z
															.union([z.enum(['minute', 'hour', 'day']), z.null()])
															.default(null),
													})
													.strict(),
												z.null(),
											])
											.optional(),
										error_after: z
											.union([
												z
													.object({
														count: z.union([z.number().int(), z.null()]).default(null),
														period: z
															.union([z.enum(['minute', 'hour', 'day']), z.null()])
															.default(null),
													})
													.strict(),
												z.null(),
											])
											.optional(),
										filter: z.union([z.string(), z.null()]).default(null),
									})
									.strict(),
								z.null(),
							])
							.default(null),
						external: z
							.union([
								z
									.object({
										_extra: z.record(z.any()).optional(),
										location: z.union([z.string(), z.null()]).default(null),
										file_format: z.union([z.string(), z.null()]).default(null),
										row_format: z.union([z.string(), z.null()]).default(null),
										tbl_properties: z.union([z.string(), z.null()]).default(null),
										partitions: z
											.union([
												z.array(z.string()),
												z.array(
													z
														.object({
															_extra: z.record(z.any()).optional(),
															name: z.string().default(''),
															description: z.string().default(''),
															data_type: z.string().default(''),
															meta: z.record(z.any()).optional(),
														})
														.catchall(z.any())
												),
												z.null(),
											])
											.default(null),
									})
									.catchall(z.any()),
								z.null(),
							])
							.default(null),
						description: z.string().default(''),
						columns: z
							.record(
								z
									.object({
										name: z.string(),
										description: z.string().default(''),
										meta: z.record(z.any()).optional(),
										data_type: z.union([z.string(), z.null()]).default(null),
										constraints: z
											.array(
												z
													.object({
														type: z.enum([
															'check',
															'not_null',
															'unique',
															'primary_key',
															'foreign_key',
															'custom',
														]),
														name: z.union([z.string(), z.null()]).default(null),
														expression: z.union([z.string(), z.null()]).default(null),
														warn_unenforced: z.boolean().default(true),
														warn_unsupported: z.boolean().default(true),
														to: z.union([z.string(), z.null()]).default(null),
														to_columns: z.array(z.string()).optional(),
													})
													.strict()
											)
											.optional(),
										quote: z.union([z.boolean(), z.null()]).default(null),
										config: z
											.object({
												_extra: z.record(z.any()).optional(),
												meta: z.record(z.any()).optional(),
												tags: z.array(z.string()).optional(),
											})
											.catchall(z.any())
											.optional(),
										tags: z.array(z.string()).optional(),
										_extra: z.record(z.any()).optional(),
										granularity: z
											.union([
												z.enum([
													'nanosecond',
													'microsecond',
													'millisecond',
													'second',
													'minute',
													'hour',
													'day',
													'week',
													'month',
													'quarter',
													'year',
												]),
												z.null(),
											])
											.default(null),
										doc_blocks: z.array(z.string()).optional(),
									})
									.catchall(z.any())
							)
							.optional(),
						meta: z.record(z.any()).optional(),
						source_meta: z.record(z.any()).optional(),
						tags: z.array(z.string()).optional(),
						config: z
							.object({
								_extra: z.record(z.any()).optional(),
								enabled: z.boolean().default(true),
								event_time: z.any().default(null),
								freshness: z
									.union([
										z
											.object({
												warn_after: z
													.union([
														z
															.object({
																count: z.union([z.number().int(), z.null()]).default(null),
																period: z
																	.union([z.enum(['minute', 'hour', 'day']), z.null()])
																	.default(null),
															})
															.strict(),
														z.null(),
													])
													.optional(),
												error_after: z
													.union([
														z
															.object({
																count: z.union([z.number().int(), z.null()]).default(null),
																period: z
																	.union([z.enum(['minute', 'hour', 'day']), z.null()])
																	.default(null),
															})
															.strict(),
														z.null(),
													])
													.optional(),
												filter: z.union([z.string(), z.null()]).default(null),
											})
											.strict(),
										z.null(),
									])
									.optional(),
								loaded_at_field: z.union([z.string(), z.null()]).default(null),
								loaded_at_query: z.union([z.string(), z.null()]).default(null),
								meta: z.record(z.any()).optional(),
								tags: z.array(z.string()).optional(),
							})
							.catchall(z.any())
							.optional(),
						patch_path: z.union([z.string(), z.null()]).default(null),
						unrendered_config: z.record(z.any()).optional(),
						relation_name: z.union([z.string(), z.null()]).default(null),
						created_at: z.number().optional(),
						unrendered_database: z.union([z.string(), z.null()]).default(null),
						unrendered_schema: z.union([z.string(), z.null()]).default(null),
						doc_blocks: z.array(z.string()).optional(),
					})
					.strict()
			)
			.describe('The sources defined in the dbt project and its dependencies'),
		/**The macros defined in the dbt project and its dependencies*/
		macros: z
			.record(
				z
					.object({
						name: z.string(),
						resource_type: z.literal('macro'),
						package_name: z.string(),
						path: z.string(),
						original_file_path: z.string(),
						unique_id: z.string(),
						macro_sql: z.string(),
						depends_on: z
							.object({ macros: z.array(z.string()).optional() })
							.strict()
							.optional(),
						description: z.string().default(''),
						meta: z.record(z.any()).optional(),
						docs: z
							.object({
								show: z.boolean().default(true),
								node_color: z.union([z.string(), z.null()]).default(null),
							})
							.strict()
							.optional(),
						patch_path: z.union([z.string(), z.null()]).default(null),
						arguments: z
							.array(
								z
									.object({
										name: z.string(),
										type: z.union([z.string(), z.null()]).default(null),
										description: z.string().default(''),
									})
									.strict()
							)
							.optional(),
						created_at: z.number().optional(),
						supported_languages: z
							.union([z.array(z.enum(['python', 'sql'])), z.null()])
							.default(null),
					})
					.strict()
			)
			.describe('The macros defined in the dbt project and its dependencies'),
		/**The docs defined in the dbt project and its dependencies*/
		docs: z
			.record(
				z
					.object({
						name: z.string(),
						resource_type: z.literal('doc'),
						package_name: z.string(),
						path: z.string(),
						original_file_path: z.string(),
						unique_id: z.string(),
						block_contents: z.string(),
					})
					.strict()
			)
			.describe('The docs defined in the dbt project and its dependencies'),
		/**The exposures defined in the dbt project and its dependencies*/
		exposures: z
			.record(
				z
					.object({
						name: z.string(),
						resource_type: z.literal('exposure'),
						package_name: z.string(),
						path: z.string(),
						original_file_path: z.string(),
						unique_id: z.string(),
						fqn: z.array(z.string()),
						type: z.enum(['dashboard', 'notebook', 'analysis', 'ml', 'application']),
						owner: z
							.object({
								_extra: z.record(z.any()).optional(),
								email: z.union([z.string(), z.array(z.string()), z.null()]).default(null),
								name: z.union([z.string(), z.null()]).default(null),
							})
							.catchall(z.any()),
						description: z.string().default(''),
						label: z.union([z.string(), z.null()]).default(null),
						maturity: z.union([z.enum(['low', 'medium', 'high']), z.null()]).default(null),
						meta: z.record(z.any()).optional(),
						tags: z.array(z.string()).optional(),
						config: z
							.object({
								_extra: z.record(z.any()).optional(),
								enabled: z.boolean().default(true),
								tags: z.array(z.string()).optional(),
								meta: z.record(z.any()).optional(),
							})
							.catchall(z.any())
							.optional(),
						unrendered_config: z.record(z.any()).optional(),
						url: z.union([z.string(), z.null()]).default(null),
						depends_on: z
							.object({
								macros: z.array(z.string()).optional(),
								nodes: z.array(z.string()).optional(),
							})
							.strict()
							.optional(),
						refs: z
							.array(
								z
									.object({
										name: z.string(),
										package: z.union([z.string(), z.null()]).default(null),
										version: z.union([z.string(), z.number(), z.null()]).default(null),
									})
									.strict()
							)
							.optional(),
						sources: z.array(z.array(z.string())).optional(),
						metrics: z.array(z.array(z.string())).optional(),
						created_at: z.number().optional(),
					})
					.strict()
			)
			.describe('The exposures defined in the dbt project and its dependencies'),
		/**The metrics defined in the dbt project and its dependencies*/
		metrics: z
			.record(
				z
					.object({
						name: z.string(),
						resource_type: z.literal('metric'),
						package_name: z.string(),
						path: z.string(),
						original_file_path: z.string(),
						unique_id: z.string(),
						fqn: z.array(z.string()),
						description: z.string(),
						label: z.string(),
						type: z.enum(['simple', 'ratio', 'cumulative', 'derived', 'conversion']),
						type_params: z
							.object({
								measure: z
									.union([
										z
											.object({
												name: z.string(),
												filter: z
													.union([
														z
															.object({
																where_filters: z.array(
																	z.object({ where_sql_template: z.string() }).strict()
																),
															})
															.strict(),
														z.null(),
													])
													.default(null),
												alias: z.union([z.string(), z.null()]).default(null),
												join_to_timespine: z.boolean().default(false),
												fill_nulls_with: z.union([z.number().int(), z.null()]).default(null),
											})
											.strict(),
										z.null(),
									])
									.default(null),
								input_measures: z
									.array(
										z
											.object({
												name: z.string(),
												filter: z
													.union([
														z
															.object({
																where_filters: z.array(
																	z.object({ where_sql_template: z.string() }).strict()
																),
															})
															.strict(),
														z.null(),
													])
													.default(null),
												alias: z.union([z.string(), z.null()]).default(null),
												join_to_timespine: z.boolean().default(false),
												fill_nulls_with: z.union([z.number().int(), z.null()]).default(null),
											})
											.strict()
									)
									.optional(),
								numerator: z
									.union([
										z
											.object({
												name: z.string(),
												filter: z
													.union([
														z
															.object({
																where_filters: z.array(
																	z.object({ where_sql_template: z.string() }).strict()
																),
															})
															.strict(),
														z.null(),
													])
													.default(null),
												alias: z.union([z.string(), z.null()]).default(null),
												offset_window: z
													.union([
														z.object({ count: z.number().int(), granularity: z.string() }).strict(),
														z.null(),
													])
													.default(null),
												offset_to_grain: z.union([z.string(), z.null()]).default(null),
											})
											.strict(),
										z.null(),
									])
									.default(null),
								denominator: z
									.union([
										z
											.object({
												name: z.string(),
												filter: z
													.union([
														z
															.object({
																where_filters: z.array(
																	z.object({ where_sql_template: z.string() }).strict()
																),
															})
															.strict(),
														z.null(),
													])
													.default(null),
												alias: z.union([z.string(), z.null()]).default(null),
												offset_window: z
													.union([
														z.object({ count: z.number().int(), granularity: z.string() }).strict(),
														z.null(),
													])
													.default(null),
												offset_to_grain: z.union([z.string(), z.null()]).default(null),
											})
											.strict(),
										z.null(),
									])
									.default(null),
								expr: z.union([z.string(), z.null()]).default(null),
								window: z
									.union([
										z.object({ count: z.number().int(), granularity: z.string() }).strict(),
										z.null(),
									])
									.default(null),
								grain_to_date: z
									.union([
										z.enum([
											'nanosecond',
											'microsecond',
											'millisecond',
											'second',
											'minute',
											'hour',
											'day',
											'week',
											'month',
											'quarter',
											'year',
										]),
										z.null(),
									])
									.default(null),
								metrics: z
									.union([
										z.array(
											z
												.object({
													name: z.string(),
													filter: z
														.union([
															z
																.object({
																	where_filters: z.array(
																		z.object({ where_sql_template: z.string() }).strict()
																	),
																})
																.strict(),
															z.null(),
														])
														.default(null),
													alias: z.union([z.string(), z.null()]).default(null),
													offset_window: z
														.union([
															z
																.object({ count: z.number().int(), granularity: z.string() })
																.strict(),
															z.null(),
														])
														.default(null),
													offset_to_grain: z.union([z.string(), z.null()]).default(null),
												})
												.strict()
										),
										z.null(),
									])
									.default(null),
								conversion_type_params: z
									.union([
										z
											.object({
												base_measure: z
													.object({
														name: z.string(),
														filter: z
															.union([
																z
																	.object({
																		where_filters: z.array(
																			z.object({ where_sql_template: z.string() }).strict()
																		),
																	})
																	.strict(),
																z.null(),
															])
															.default(null),
														alias: z.union([z.string(), z.null()]).default(null),
														join_to_timespine: z.boolean().default(false),
														fill_nulls_with: z.union([z.number().int(), z.null()]).default(null),
													})
													.strict(),
												conversion_measure: z
													.object({
														name: z.string(),
														filter: z
															.union([
																z
																	.object({
																		where_filters: z.array(
																			z.object({ where_sql_template: z.string() }).strict()
																		),
																	})
																	.strict(),
																z.null(),
															])
															.default(null),
														alias: z.union([z.string(), z.null()]).default(null),
														join_to_timespine: z.boolean().default(false),
														fill_nulls_with: z.union([z.number().int(), z.null()]).default(null),
													})
													.strict(),
												entity: z.string(),
												calculation: z
													.enum(['conversions', 'conversion_rate'])
													.default('conversion_rate'),
												window: z
													.union([
														z.object({ count: z.number().int(), granularity: z.string() }).strict(),
														z.null(),
													])
													.default(null),
												constant_properties: z
													.union([
														z.array(
															z
																.object({
																	base_property: z.string(),
																	conversion_property: z.string(),
																})
																.strict()
														),
														z.null(),
													])
													.default(null),
											})
											.strict(),
										z.null(),
									])
									.default(null),
								cumulative_type_params: z
									.union([
										z
											.object({
												window: z
													.union([
														z.object({ count: z.number().int(), granularity: z.string() }).strict(),
														z.null(),
													])
													.default(null),
												grain_to_date: z.union([z.string(), z.null()]).default(null),
												period_agg: z.enum(['first', 'last', 'average']).default('first'),
											})
											.strict(),
										z.null(),
									])
									.default(null),
							})
							.strict(),
						filter: z
							.union([
								z
									.object({
										where_filters: z.array(z.object({ where_sql_template: z.string() }).strict()),
									})
									.strict(),
								z.null(),
							])
							.default(null),
						metadata: z
							.union([
								z
									.object({
										repo_file_path: z.string(),
										file_slice: z
											.object({
												filename: z.string(),
												content: z.string(),
												start_line_number: z.number().int(),
												end_line_number: z.number().int(),
											})
											.strict(),
									})
									.strict(),
								z.null(),
							])
							.default(null),
						time_granularity: z.union([z.string(), z.null()]).default(null),
						meta: z.record(z.any()).optional(),
						tags: z.array(z.string()).optional(),
						config: z
							.object({
								_extra: z.record(z.any()).optional(),
								enabled: z.boolean().default(true),
								group: z.union([z.string(), z.null()]).default(null),
								meta: z.record(z.any()).optional(),
							})
							.catchall(z.any())
							.optional(),
						unrendered_config: z.record(z.any()).optional(),
						sources: z.array(z.array(z.string())).optional(),
						depends_on: z
							.object({
								macros: z.array(z.string()).optional(),
								nodes: z.array(z.string()).optional(),
							})
							.strict()
							.optional(),
						refs: z
							.array(
								z
									.object({
										name: z.string(),
										package: z.union([z.string(), z.null()]).default(null),
										version: z.union([z.string(), z.number(), z.null()]).default(null),
									})
									.strict()
							)
							.optional(),
						metrics: z.array(z.array(z.string())).optional(),
						created_at: z.number().optional(),
						group: z.union([z.string(), z.null()]).default(null),
					})
					.strict()
			)
			.describe('The metrics defined in the dbt project and its dependencies'),
		/**The groups defined in the dbt project*/
		groups: z
			.record(
				z
					.object({
						name: z.string(),
						resource_type: z.literal('group'),
						package_name: z.string(),
						path: z.string(),
						original_file_path: z.string(),
						unique_id: z.string(),
						owner: z
							.object({
								_extra: z.record(z.any()).optional(),
								email: z.union([z.string(), z.array(z.string()), z.null()]).default(null),
								name: z.union([z.string(), z.null()]).default(null),
							})
							.catchall(z.any()),
						description: z.union([z.string(), z.null()]).default(null),
						config: z
							.object({ _extra: z.record(z.any()).optional(), meta: z.record(z.any()).optional() })
							.catchall(z.any())
							.optional(),
					})
					.strict()
			)
			.describe('The groups defined in the dbt project'),
		/**The selectors defined in selectors.yml*/
		selectors: z.record(z.any()).describe('The selectors defined in selectors.yml'),
		/**A mapping of the disabled nodes in the target*/
		disabled: z
			.union([
				z.record(
					z.array(
						z.union([
							z
								.object({
									database: z.union([z.string(), z.null()]),
									schema: z.string(),
									name: z.string(),
									resource_type: z.literal('seed'),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									alias: z.string(),
									checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											alias: z.union([z.string(), z.null()]).default(null),
											schema: z.union([z.string(), z.null()]).default(null),
											database: z.union([z.string(), z.null()]).default(null),
											tags: z.union([z.array(z.string()), z.string()]).optional(),
											meta: z.record(z.any()).optional(),
											group: z.union([z.string(), z.null()]).default(null),
											materialized: z.string().default('seed'),
											incremental_strategy: z.union([z.string(), z.null()]).default(null),
											batch_size: z.any().default(null),
											lookback: z.any().default(1),
											begin: z.any().default(null),
											persist_docs: z.record(z.any()).optional(),
											'post-hook': z
												.array(
													z
														.object({
															sql: z.string(),
															transaction: z.boolean().default(true),
															index: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											'pre-hook': z
												.array(
													z
														.object({
															sql: z.string(),
															transaction: z.boolean().default(true),
															index: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											quoting: z.record(z.any()).optional(),
											column_types: z.record(z.any()).optional(),
											full_refresh: z.union([z.boolean(), z.null()]).default(null),
											unique_key: z
												.union([z.string(), z.array(z.string()), z.null()])
												.default(null),
											on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
											on_configuration_change: z.enum(['apply', 'continue', 'fail']).optional(),
											grants: z.record(z.any()).optional(),
											packages: z.array(z.string()).optional(),
											docs: z
												.object({
													show: z.boolean().default(true),
													node_color: z.union([z.string(), z.null()]).default(null),
												})
												.strict()
												.optional(),
											contract: z
												.object({
													enforced: z.boolean().default(false),
													alias_types: z.boolean().default(true),
												})
												.strict()
												.optional(),
											event_time: z.any().default(null),
											concurrent_batches: z.any().default(null),
											delimiter: z.string().default(','),
											quote_columns: z.union([z.boolean(), z.null()]).default(null),
										})
										.catchall(z.any())
										.optional(),
									tags: z.array(z.string()).optional(),
									description: z.string().default(''),
									columns: z
										.record(
											z
												.object({
													name: z.string(),
													description: z.string().default(''),
													meta: z.record(z.any()).optional(),
													data_type: z.union([z.string(), z.null()]).default(null),
													constraints: z
														.array(
															z
																.object({
																	type: z.enum([
																		'check',
																		'not_null',
																		'unique',
																		'primary_key',
																		'foreign_key',
																		'custom',
																	]),
																	name: z.union([z.string(), z.null()]).default(null),
																	expression: z.union([z.string(), z.null()]).default(null),
																	warn_unenforced: z.boolean().default(true),
																	warn_unsupported: z.boolean().default(true),
																	to: z.union([z.string(), z.null()]).default(null),
																	to_columns: z.array(z.string()).optional(),
																})
																.strict()
														)
														.optional(),
													quote: z.union([z.boolean(), z.null()]).default(null),
													config: z
														.object({
															_extra: z.record(z.any()).optional(),
															meta: z.record(z.any()).optional(),
															tags: z.array(z.string()).optional(),
														})
														.catchall(z.any())
														.optional(),
													tags: z.array(z.string()).optional(),
													_extra: z.record(z.any()).optional(),
													granularity: z
														.union([
															z.enum([
																'nanosecond',
																'microsecond',
																'millisecond',
																'second',
																'minute',
																'hour',
																'day',
																'week',
																'month',
																'quarter',
																'year',
															]),
															z.null(),
														])
														.default(null),
													doc_blocks: z.array(z.string()).optional(),
												})
												.catchall(z.any())
										)
										.optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									patch_path: z.union([z.string(), z.null()]).default(null),
									build_path: z.union([z.string(), z.null()]).default(null),
									unrendered_config: z.record(z.any()).optional(),
									created_at: z.number().optional(),
									config_call_dict: z.record(z.any()).optional(),
									unrendered_config_call_dict: z.record(z.any()).optional(),
									relation_name: z.union([z.string(), z.null()]).default(null),
									raw_code: z.string().default(''),
									doc_blocks: z.array(z.string()).optional(),
									root_path: z.union([z.string(), z.null()]).default(null),
									depends_on: z
										.object({ macros: z.array(z.string()).optional() })
										.strict()
										.optional(),
									defer_relation: z
										.union([
											z
												.object({
													database: z.union([z.string(), z.null()]),
													schema: z.string(),
													alias: z.string(),
													relation_name: z.union([z.string(), z.null()]),
													resource_type: z.enum([
														'model',
														'analysis',
														'test',
														'snapshot',
														'operation',
														'seed',
														'rpc',
														'sql_operation',
														'doc',
														'source',
														'macro',
														'exposure',
														'metric',
														'group',
														'saved_query',
														'semantic_model',
														'unit_test',
														'fixture',
													]),
													name: z.string(),
													description: z.string(),
													compiled_code: z.union([z.string(), z.null()]),
													meta: z.record(z.any()),
													tags: z.array(z.string()),
													config: z.union([
														z
															.object({
																_extra: z.record(z.any()).optional(),
																enabled: z.boolean().default(true),
																alias: z.union([z.string(), z.null()]).default(null),
																schema: z.union([z.string(), z.null()]).default(null),
																database: z.union([z.string(), z.null()]).default(null),
																tags: z.union([z.array(z.string()), z.string()]).optional(),
																meta: z.record(z.any()).optional(),
																group: z.union([z.string(), z.null()]).default(null),
																materialized: z.string().default('view'),
																incremental_strategy: z.union([z.string(), z.null()]).default(null),
																batch_size: z.any().default(null),
																lookback: z.any().default(1),
																begin: z.any().default(null),
																persist_docs: z.record(z.any()).optional(),
																'post-hook': z
																	.array(
																		z
																			.object({
																				sql: z.string(),
																				transaction: z.boolean().default(true),
																				index: z.union([z.number().int(), z.null()]).default(null),
																			})
																			.strict()
																	)
																	.optional(),
																'pre-hook': z
																	.array(
																		z
																			.object({
																				sql: z.string(),
																				transaction: z.boolean().default(true),
																				index: z.union([z.number().int(), z.null()]).default(null),
																			})
																			.strict()
																	)
																	.optional(),
																quoting: z.record(z.any()).optional(),
																column_types: z.record(z.any()).optional(),
																full_refresh: z.union([z.boolean(), z.null()]).default(null),
																unique_key: z
																	.union([z.string(), z.array(z.string()), z.null()])
																	.default(null),
																on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
																on_configuration_change: z
																	.enum(['apply', 'continue', 'fail'])
																	.optional(),
																grants: z.record(z.any()).optional(),
																packages: z.array(z.string()).optional(),
																docs: z
																	.object({
																		show: z.boolean().default(true),
																		node_color: z.union([z.string(), z.null()]).default(null),
																	})
																	.strict()
																	.optional(),
																contract: z
																	.object({
																		enforced: z.boolean().default(false),
																		alias_types: z.boolean().default(true),
																	})
																	.strict()
																	.optional(),
																event_time: z.any().default(null),
																concurrent_batches: z.any().default(null),
															})
															.catchall(z.any()),
														z.null(),
													]),
												})
												.strict(),
											z.null(),
										])
										.default(null),
								})
								.strict(),
							z
								.object({
									database: z.union([z.string(), z.null()]),
									schema: z.string(),
									name: z.string(),
									resource_type: z.literal('analysis'),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									alias: z.string(),
									checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											alias: z.union([z.string(), z.null()]).default(null),
											schema: z.union([z.string(), z.null()]).default(null),
											database: z.union([z.string(), z.null()]).default(null),
											tags: z.union([z.array(z.string()), z.string()]).optional(),
											meta: z.record(z.any()).optional(),
											group: z.union([z.string(), z.null()]).default(null),
											materialized: z.string().default('view'),
											incremental_strategy: z.union([z.string(), z.null()]).default(null),
											batch_size: z.any().default(null),
											lookback: z.any().default(1),
											begin: z.any().default(null),
											persist_docs: z.record(z.any()).optional(),
											'post-hook': z
												.array(
													z
														.object({
															sql: z.string(),
															transaction: z.boolean().default(true),
															index: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											'pre-hook': z
												.array(
													z
														.object({
															sql: z.string(),
															transaction: z.boolean().default(true),
															index: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											quoting: z.record(z.any()).optional(),
											column_types: z.record(z.any()).optional(),
											full_refresh: z.union([z.boolean(), z.null()]).default(null),
											unique_key: z
												.union([z.string(), z.array(z.string()), z.null()])
												.default(null),
											on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
											on_configuration_change: z.enum(['apply', 'continue', 'fail']).optional(),
											grants: z.record(z.any()).optional(),
											packages: z.array(z.string()).optional(),
											docs: z
												.object({
													show: z.boolean().default(true),
													node_color: z.union([z.string(), z.null()]).default(null),
												})
												.strict()
												.optional(),
											contract: z
												.object({
													enforced: z.boolean().default(false),
													alias_types: z.boolean().default(true),
												})
												.strict()
												.optional(),
											event_time: z.any().default(null),
											concurrent_batches: z.any().default(null),
										})
										.catchall(z.any())
										.optional(),
									tags: z.array(z.string()).optional(),
									description: z.string().default(''),
									columns: z
										.record(
											z
												.object({
													name: z.string(),
													description: z.string().default(''),
													meta: z.record(z.any()).optional(),
													data_type: z.union([z.string(), z.null()]).default(null),
													constraints: z
														.array(
															z
																.object({
																	type: z.enum([
																		'check',
																		'not_null',
																		'unique',
																		'primary_key',
																		'foreign_key',
																		'custom',
																	]),
																	name: z.union([z.string(), z.null()]).default(null),
																	expression: z.union([z.string(), z.null()]).default(null),
																	warn_unenforced: z.boolean().default(true),
																	warn_unsupported: z.boolean().default(true),
																	to: z.union([z.string(), z.null()]).default(null),
																	to_columns: z.array(z.string()).optional(),
																})
																.strict()
														)
														.optional(),
													quote: z.union([z.boolean(), z.null()]).default(null),
													config: z
														.object({
															_extra: z.record(z.any()).optional(),
															meta: z.record(z.any()).optional(),
															tags: z.array(z.string()).optional(),
														})
														.catchall(z.any())
														.optional(),
													tags: z.array(z.string()).optional(),
													_extra: z.record(z.any()).optional(),
													granularity: z
														.union([
															z.enum([
																'nanosecond',
																'microsecond',
																'millisecond',
																'second',
																'minute',
																'hour',
																'day',
																'week',
																'month',
																'quarter',
																'year',
															]),
															z.null(),
														])
														.default(null),
													doc_blocks: z.array(z.string()).optional(),
												})
												.catchall(z.any())
										)
										.optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									patch_path: z.union([z.string(), z.null()]).default(null),
									build_path: z.union([z.string(), z.null()]).default(null),
									unrendered_config: z.record(z.any()).optional(),
									created_at: z.number().optional(),
									config_call_dict: z.record(z.any()).optional(),
									unrendered_config_call_dict: z.record(z.any()).optional(),
									relation_name: z.union([z.string(), z.null()]).default(null),
									raw_code: z.string().default(''),
									doc_blocks: z.array(z.string()).optional(),
									language: z.string().default('sql'),
									refs: z
										.array(
											z
												.object({
													name: z.string(),
													package: z.union([z.string(), z.null()]).default(null),
													version: z.union([z.string(), z.number(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									sources: z.array(z.array(z.string())).optional(),
									metrics: z.array(z.array(z.string())).optional(),
									depends_on: z
										.object({
											macros: z.array(z.string()).optional(),
											nodes: z.array(z.string()).optional(),
										})
										.strict()
										.optional(),
									compiled_path: z.union([z.string(), z.null()]).default(null),
									compiled: z.boolean().default(false),
									compiled_code: z.union([z.string(), z.null()]).default(null),
									extra_ctes_injected: z.boolean().default(false),
									extra_ctes: z
										.array(z.object({ id: z.string(), sql: z.string() }).strict())
										.optional(),
									_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
											checksum: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
								})
								.strict(),
							z
								.object({
									database: z.union([z.string(), z.null()]),
									schema: z.string(),
									name: z.string(),
									resource_type: z.literal('test'),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									alias: z.string(),
									checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											alias: z.union([z.string(), z.null()]).default(null),
											schema: z.union([z.string(), z.null()]).default('dbt_test__audit'),
											database: z.union([z.string(), z.null()]).default(null),
											tags: z.union([z.array(z.string()), z.string()]).optional(),
											meta: z.record(z.any()).optional(),
											group: z.union([z.string(), z.null()]).default(null),
											materialized: z.string().default('test'),
											severity: z
												.string()
												.regex(new RegExp('^([Ww][Aa][Rr][Nn]|[Ee][Rr][Rr][Oo][Rr])$'))
												.default('ERROR'),
											store_failures: z.union([z.boolean(), z.null()]).default(null),
											store_failures_as: z.union([z.string(), z.null()]).default(null),
											where: z.union([z.string(), z.null()]).default(null),
											limit: z.union([z.number().int(), z.null()]).default(null),
											fail_calc: z.string().default('count(*)'),
											warn_if: z.string().default('!= 0'),
											error_if: z.string().default('!= 0'),
										})
										.catchall(z.any())
										.optional(),
									tags: z.array(z.string()).optional(),
									description: z.string().default(''),
									columns: z
										.record(
											z
												.object({
													name: z.string(),
													description: z.string().default(''),
													meta: z.record(z.any()).optional(),
													data_type: z.union([z.string(), z.null()]).default(null),
													constraints: z
														.array(
															z
																.object({
																	type: z.enum([
																		'check',
																		'not_null',
																		'unique',
																		'primary_key',
																		'foreign_key',
																		'custom',
																	]),
																	name: z.union([z.string(), z.null()]).default(null),
																	expression: z.union([z.string(), z.null()]).default(null),
																	warn_unenforced: z.boolean().default(true),
																	warn_unsupported: z.boolean().default(true),
																	to: z.union([z.string(), z.null()]).default(null),
																	to_columns: z.array(z.string()).optional(),
																})
																.strict()
														)
														.optional(),
													quote: z.union([z.boolean(), z.null()]).default(null),
													config: z
														.object({
															_extra: z.record(z.any()).optional(),
															meta: z.record(z.any()).optional(),
															tags: z.array(z.string()).optional(),
														})
														.catchall(z.any())
														.optional(),
													tags: z.array(z.string()).optional(),
													_extra: z.record(z.any()).optional(),
													granularity: z
														.union([
															z.enum([
																'nanosecond',
																'microsecond',
																'millisecond',
																'second',
																'minute',
																'hour',
																'day',
																'week',
																'month',
																'quarter',
																'year',
															]),
															z.null(),
														])
														.default(null),
													doc_blocks: z.array(z.string()).optional(),
												})
												.catchall(z.any())
										)
										.optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									patch_path: z.union([z.string(), z.null()]).default(null),
									build_path: z.union([z.string(), z.null()]).default(null),
									unrendered_config: z.record(z.any()).optional(),
									created_at: z.number().optional(),
									config_call_dict: z.record(z.any()).optional(),
									unrendered_config_call_dict: z.record(z.any()).optional(),
									relation_name: z.union([z.string(), z.null()]).default(null),
									raw_code: z.string().default(''),
									doc_blocks: z.array(z.string()).optional(),
									language: z.string().default('sql'),
									refs: z
										.array(
											z
												.object({
													name: z.string(),
													package: z.union([z.string(), z.null()]).default(null),
													version: z.union([z.string(), z.number(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									sources: z.array(z.array(z.string())).optional(),
									metrics: z.array(z.array(z.string())).optional(),
									depends_on: z
										.object({
											macros: z.array(z.string()).optional(),
											nodes: z.array(z.string()).optional(),
										})
										.strict()
										.optional(),
									compiled_path: z.union([z.string(), z.null()]).default(null),
									compiled: z.boolean().default(false),
									compiled_code: z.union([z.string(), z.null()]).default(null),
									extra_ctes_injected: z.boolean().default(false),
									extra_ctes: z
										.array(z.object({ id: z.string(), sql: z.string() }).strict())
										.optional(),
									_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
											checksum: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
								})
								.strict(),
							z
								.object({
									database: z.union([z.string(), z.null()]),
									schema: z.string(),
									name: z.string(),
									resource_type: z.literal('operation'),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									alias: z.string(),
									checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											alias: z.union([z.string(), z.null()]).default(null),
											schema: z.union([z.string(), z.null()]).default(null),
											database: z.union([z.string(), z.null()]).default(null),
											tags: z.union([z.array(z.string()), z.string()]).optional(),
											meta: z.record(z.any()).optional(),
											group: z.union([z.string(), z.null()]).default(null),
											materialized: z.string().default('view'),
											incremental_strategy: z.union([z.string(), z.null()]).default(null),
											batch_size: z.any().default(null),
											lookback: z.any().default(1),
											begin: z.any().default(null),
											persist_docs: z.record(z.any()).optional(),
											'post-hook': z
												.array(
													z
														.object({
															sql: z.string(),
															transaction: z.boolean().default(true),
															index: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											'pre-hook': z
												.array(
													z
														.object({
															sql: z.string(),
															transaction: z.boolean().default(true),
															index: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											quoting: z.record(z.any()).optional(),
											column_types: z.record(z.any()).optional(),
											full_refresh: z.union([z.boolean(), z.null()]).default(null),
											unique_key: z
												.union([z.string(), z.array(z.string()), z.null()])
												.default(null),
											on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
											on_configuration_change: z.enum(['apply', 'continue', 'fail']).optional(),
											grants: z.record(z.any()).optional(),
											packages: z.array(z.string()).optional(),
											docs: z
												.object({
													show: z.boolean().default(true),
													node_color: z.union([z.string(), z.null()]).default(null),
												})
												.strict()
												.optional(),
											contract: z
												.object({
													enforced: z.boolean().default(false),
													alias_types: z.boolean().default(true),
												})
												.strict()
												.optional(),
											event_time: z.any().default(null),
											concurrent_batches: z.any().default(null),
										})
										.catchall(z.any())
										.optional(),
									tags: z.array(z.string()).optional(),
									description: z.string().default(''),
									columns: z
										.record(
											z
												.object({
													name: z.string(),
													description: z.string().default(''),
													meta: z.record(z.any()).optional(),
													data_type: z.union([z.string(), z.null()]).default(null),
													constraints: z
														.array(
															z
																.object({
																	type: z.enum([
																		'check',
																		'not_null',
																		'unique',
																		'primary_key',
																		'foreign_key',
																		'custom',
																	]),
																	name: z.union([z.string(), z.null()]).default(null),
																	expression: z.union([z.string(), z.null()]).default(null),
																	warn_unenforced: z.boolean().default(true),
																	warn_unsupported: z.boolean().default(true),
																	to: z.union([z.string(), z.null()]).default(null),
																	to_columns: z.array(z.string()).optional(),
																})
																.strict()
														)
														.optional(),
													quote: z.union([z.boolean(), z.null()]).default(null),
													config: z
														.object({
															_extra: z.record(z.any()).optional(),
															meta: z.record(z.any()).optional(),
															tags: z.array(z.string()).optional(),
														})
														.catchall(z.any())
														.optional(),
													tags: z.array(z.string()).optional(),
													_extra: z.record(z.any()).optional(),
													granularity: z
														.union([
															z.enum([
																'nanosecond',
																'microsecond',
																'millisecond',
																'second',
																'minute',
																'hour',
																'day',
																'week',
																'month',
																'quarter',
																'year',
															]),
															z.null(),
														])
														.default(null),
													doc_blocks: z.array(z.string()).optional(),
												})
												.catchall(z.any())
										)
										.optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									patch_path: z.union([z.string(), z.null()]).default(null),
									build_path: z.union([z.string(), z.null()]).default(null),
									unrendered_config: z.record(z.any()).optional(),
									created_at: z.number().optional(),
									config_call_dict: z.record(z.any()).optional(),
									unrendered_config_call_dict: z.record(z.any()).optional(),
									relation_name: z.union([z.string(), z.null()]).default(null),
									raw_code: z.string().default(''),
									doc_blocks: z.array(z.string()).optional(),
									language: z.string().default('sql'),
									refs: z
										.array(
											z
												.object({
													name: z.string(),
													package: z.union([z.string(), z.null()]).default(null),
													version: z.union([z.string(), z.number(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									sources: z.array(z.array(z.string())).optional(),
									metrics: z.array(z.array(z.string())).optional(),
									depends_on: z
										.object({
											macros: z.array(z.string()).optional(),
											nodes: z.array(z.string()).optional(),
										})
										.strict()
										.optional(),
									compiled_path: z.union([z.string(), z.null()]).default(null),
									compiled: z.boolean().default(false),
									compiled_code: z.union([z.string(), z.null()]).default(null),
									extra_ctes_injected: z.boolean().default(false),
									extra_ctes: z
										.array(z.object({ id: z.string(), sql: z.string() }).strict())
										.optional(),
									_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
											checksum: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									index: z.union([z.number().int(), z.null()]).default(null),
								})
								.strict(),
							z
								.object({
									database: z.union([z.string(), z.null()]),
									schema: z.string(),
									name: z.string(),
									resource_type: z.literal('model'),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									alias: z.string(),
									checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											alias: z.union([z.string(), z.null()]).default(null),
											schema: z.union([z.string(), z.null()]).default(null),
											database: z.union([z.string(), z.null()]).default(null),
											tags: z.union([z.array(z.string()), z.string()]).optional(),
											meta: z.record(z.any()).optional(),
											group: z.union([z.string(), z.null()]).default(null),
											materialized: z.string().default('view'),
											incremental_strategy: z.union([z.string(), z.null()]).default(null),
											batch_size: z.any().default(null),
											lookback: z.any().default(1),
											begin: z.any().default(null),
											persist_docs: z.record(z.any()).optional(),
											'post-hook': z
												.array(
													z
														.object({
															sql: z.string(),
															transaction: z.boolean().default(true),
															index: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											'pre-hook': z
												.array(
													z
														.object({
															sql: z.string(),
															transaction: z.boolean().default(true),
															index: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											quoting: z.record(z.any()).optional(),
											column_types: z.record(z.any()).optional(),
											full_refresh: z.union([z.boolean(), z.null()]).default(null),
											unique_key: z
												.union([z.string(), z.array(z.string()), z.null()])
												.default(null),
											on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
											on_configuration_change: z.enum(['apply', 'continue', 'fail']).optional(),
											grants: z.record(z.any()).optional(),
											packages: z.array(z.string()).optional(),
											docs: z
												.object({
													show: z.boolean().default(true),
													node_color: z.union([z.string(), z.null()]).default(null),
												})
												.strict()
												.optional(),
											contract: z
												.object({
													enforced: z.boolean().default(false),
													alias_types: z.boolean().default(true),
												})
												.strict()
												.optional(),
											event_time: z.any().default(null),
											concurrent_batches: z.any().default(null),
											access: z.enum(['private', 'protected', 'public']).default('protected'),
											freshness: z
												.union([
													z
														.object({
															build_after: z
																.object({
																	count: z.number().int(),
																	period: z.enum(['minute', 'hour', 'day']),
																	updates_on: z.enum(['all', 'any']).default('any'),
																})
																.catchall(z.any()),
														})
														.catchall(z.any()),
													z.null(),
												])
												.default(null),
										})
										.catchall(z.any())
										.optional(),
									tags: z.array(z.string()).optional(),
									description: z.string().default(''),
									columns: z
										.record(
											z
												.object({
													name: z.string(),
													description: z.string().default(''),
													meta: z.record(z.any()).optional(),
													data_type: z.union([z.string(), z.null()]).default(null),
													constraints: z
														.array(
															z
																.object({
																	type: z.enum([
																		'check',
																		'not_null',
																		'unique',
																		'primary_key',
																		'foreign_key',
																		'custom',
																	]),
																	name: z.union([z.string(), z.null()]).default(null),
																	expression: z.union([z.string(), z.null()]).default(null),
																	warn_unenforced: z.boolean().default(true),
																	warn_unsupported: z.boolean().default(true),
																	to: z.union([z.string(), z.null()]).default(null),
																	to_columns: z.array(z.string()).optional(),
																})
																.strict()
														)
														.optional(),
													quote: z.union([z.boolean(), z.null()]).default(null),
													config: z
														.object({
															_extra: z.record(z.any()).optional(),
															meta: z.record(z.any()).optional(),
															tags: z.array(z.string()).optional(),
														})
														.catchall(z.any())
														.optional(),
													tags: z.array(z.string()).optional(),
													_extra: z.record(z.any()).optional(),
													granularity: z
														.union([
															z.enum([
																'nanosecond',
																'microsecond',
																'millisecond',
																'second',
																'minute',
																'hour',
																'day',
																'week',
																'month',
																'quarter',
																'year',
															]),
															z.null(),
														])
														.default(null),
													doc_blocks: z.array(z.string()).optional(),
												})
												.catchall(z.any())
										)
										.optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									patch_path: z.union([z.string(), z.null()]).default(null),
									build_path: z.union([z.string(), z.null()]).default(null),
									unrendered_config: z.record(z.any()).optional(),
									created_at: z.number().optional(),
									config_call_dict: z.record(z.any()).optional(),
									unrendered_config_call_dict: z.record(z.any()).optional(),
									relation_name: z.union([z.string(), z.null()]).default(null),
									raw_code: z.string().default(''),
									doc_blocks: z.array(z.string()).optional(),
									language: z.string().default('sql'),
									refs: z
										.array(
											z
												.object({
													name: z.string(),
													package: z.union([z.string(), z.null()]).default(null),
													version: z.union([z.string(), z.number(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									sources: z.array(z.array(z.string())).optional(),
									metrics: z.array(z.array(z.string())).optional(),
									depends_on: z
										.object({
											macros: z.array(z.string()).optional(),
											nodes: z.array(z.string()).optional(),
										})
										.strict()
										.optional(),
									compiled_path: z.union([z.string(), z.null()]).default(null),
									compiled: z.boolean().default(false),
									compiled_code: z.union([z.string(), z.null()]).default(null),
									extra_ctes_injected: z.boolean().default(false),
									extra_ctes: z
										.array(z.object({ id: z.string(), sql: z.string() }).strict())
										.optional(),
									_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
											checksum: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									access: z.enum(['private', 'protected', 'public']).default('protected'),
									constraints: z
										.array(
											z
												.object({
													type: z.enum([
														'check',
														'not_null',
														'unique',
														'primary_key',
														'foreign_key',
														'custom',
													]),
													name: z.union([z.string(), z.null()]).default(null),
													expression: z.union([z.string(), z.null()]).default(null),
													warn_unenforced: z.boolean().default(true),
													warn_unsupported: z.boolean().default(true),
													to: z.union([z.string(), z.null()]).default(null),
													to_columns: z.array(z.string()).optional(),
													columns: z.array(z.string()).optional(),
												})
												.strict()
										)
										.optional(),
									version: z.union([z.string(), z.number(), z.null()]).default(null),
									latest_version: z.union([z.string(), z.number(), z.null()]).default(null),
									deprecation_date: z.union([z.string(), z.null()]).default(null),
									defer_relation: z
										.union([
											z
												.object({
													database: z.union([z.string(), z.null()]),
													schema: z.string(),
													alias: z.string(),
													relation_name: z.union([z.string(), z.null()]),
													resource_type: z.enum([
														'model',
														'analysis',
														'test',
														'snapshot',
														'operation',
														'seed',
														'rpc',
														'sql_operation',
														'doc',
														'source',
														'macro',
														'exposure',
														'metric',
														'group',
														'saved_query',
														'semantic_model',
														'unit_test',
														'fixture',
													]),
													name: z.string(),
													description: z.string(),
													compiled_code: z.union([z.string(), z.null()]),
													meta: z.record(z.any()),
													tags: z.array(z.string()),
													config: z.union([
														z
															.object({
																_extra: z.record(z.any()).optional(),
																enabled: z.boolean().default(true),
																alias: z.union([z.string(), z.null()]).default(null),
																schema: z.union([z.string(), z.null()]).default(null),
																database: z.union([z.string(), z.null()]).default(null),
																tags: z.union([z.array(z.string()), z.string()]).optional(),
																meta: z.record(z.any()).optional(),
																group: z.union([z.string(), z.null()]).default(null),
																materialized: z.string().default('view'),
																incremental_strategy: z.union([z.string(), z.null()]).default(null),
																batch_size: z.any().default(null),
																lookback: z.any().default(1),
																begin: z.any().default(null),
																persist_docs: z.record(z.any()).optional(),
																'post-hook': z
																	.array(
																		z
																			.object({
																				sql: z.string(),
																				transaction: z.boolean().default(true),
																				index: z.union([z.number().int(), z.null()]).default(null),
																			})
																			.strict()
																	)
																	.optional(),
																'pre-hook': z
																	.array(
																		z
																			.object({
																				sql: z.string(),
																				transaction: z.boolean().default(true),
																				index: z.union([z.number().int(), z.null()]).default(null),
																			})
																			.strict()
																	)
																	.optional(),
																quoting: z.record(z.any()).optional(),
																column_types: z.record(z.any()).optional(),
																full_refresh: z.union([z.boolean(), z.null()]).default(null),
																unique_key: z
																	.union([z.string(), z.array(z.string()), z.null()])
																	.default(null),
																on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
																on_configuration_change: z
																	.enum(['apply', 'continue', 'fail'])
																	.optional(),
																grants: z.record(z.any()).optional(),
																packages: z.array(z.string()).optional(),
																docs: z
																	.object({
																		show: z.boolean().default(true),
																		node_color: z.union([z.string(), z.null()]).default(null),
																	})
																	.strict()
																	.optional(),
																contract: z
																	.object({
																		enforced: z.boolean().default(false),
																		alias_types: z.boolean().default(true),
																	})
																	.strict()
																	.optional(),
																event_time: z.any().default(null),
																concurrent_batches: z.any().default(null),
															})
															.catchall(z.any()),
														z.null(),
													]),
												})
												.strict(),
											z.null(),
										])
										.default(null),
									primary_key: z.array(z.string()).optional(),
									time_spine: z
										.union([
											z
												.object({
													standard_granularity_column: z.string(),
													custom_granularities: z
														.array(
															z
																.object({
																	name: z.string(),
																	column_name: z.union([z.string(), z.null()]).default(null),
																})
																.strict()
														)
														.optional(),
												})
												.strict(),
											z.null(),
										])
										.default(null),
								})
								.strict(),
							z
								.object({
									database: z.union([z.string(), z.null()]),
									schema: z.string(),
									name: z.string(),
									resource_type: z.literal('sql_operation'),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									alias: z.string(),
									checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											alias: z.union([z.string(), z.null()]).default(null),
											schema: z.union([z.string(), z.null()]).default(null),
											database: z.union([z.string(), z.null()]).default(null),
											tags: z.union([z.array(z.string()), z.string()]).optional(),
											meta: z.record(z.any()).optional(),
											group: z.union([z.string(), z.null()]).default(null),
											materialized: z.string().default('view'),
											incremental_strategy: z.union([z.string(), z.null()]).default(null),
											batch_size: z.any().default(null),
											lookback: z.any().default(1),
											begin: z.any().default(null),
											persist_docs: z.record(z.any()).optional(),
											'post-hook': z
												.array(
													z
														.object({
															sql: z.string(),
															transaction: z.boolean().default(true),
															index: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											'pre-hook': z
												.array(
													z
														.object({
															sql: z.string(),
															transaction: z.boolean().default(true),
															index: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											quoting: z.record(z.any()).optional(),
											column_types: z.record(z.any()).optional(),
											full_refresh: z.union([z.boolean(), z.null()]).default(null),
											unique_key: z
												.union([z.string(), z.array(z.string()), z.null()])
												.default(null),
											on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
											on_configuration_change: z.enum(['apply', 'continue', 'fail']).optional(),
											grants: z.record(z.any()).optional(),
											packages: z.array(z.string()).optional(),
											docs: z
												.object({
													show: z.boolean().default(true),
													node_color: z.union([z.string(), z.null()]).default(null),
												})
												.strict()
												.optional(),
											contract: z
												.object({
													enforced: z.boolean().default(false),
													alias_types: z.boolean().default(true),
												})
												.strict()
												.optional(),
											event_time: z.any().default(null),
											concurrent_batches: z.any().default(null),
										})
										.catchall(z.any())
										.optional(),
									tags: z.array(z.string()).optional(),
									description: z.string().default(''),
									columns: z
										.record(
											z
												.object({
													name: z.string(),
													description: z.string().default(''),
													meta: z.record(z.any()).optional(),
													data_type: z.union([z.string(), z.null()]).default(null),
													constraints: z
														.array(
															z
																.object({
																	type: z.enum([
																		'check',
																		'not_null',
																		'unique',
																		'primary_key',
																		'foreign_key',
																		'custom',
																	]),
																	name: z.union([z.string(), z.null()]).default(null),
																	expression: z.union([z.string(), z.null()]).default(null),
																	warn_unenforced: z.boolean().default(true),
																	warn_unsupported: z.boolean().default(true),
																	to: z.union([z.string(), z.null()]).default(null),
																	to_columns: z.array(z.string()).optional(),
																})
																.strict()
														)
														.optional(),
													quote: z.union([z.boolean(), z.null()]).default(null),
													config: z
														.object({
															_extra: z.record(z.any()).optional(),
															meta: z.record(z.any()).optional(),
															tags: z.array(z.string()).optional(),
														})
														.catchall(z.any())
														.optional(),
													tags: z.array(z.string()).optional(),
													_extra: z.record(z.any()).optional(),
													granularity: z
														.union([
															z.enum([
																'nanosecond',
																'microsecond',
																'millisecond',
																'second',
																'minute',
																'hour',
																'day',
																'week',
																'month',
																'quarter',
																'year',
															]),
															z.null(),
														])
														.default(null),
													doc_blocks: z.array(z.string()).optional(),
												})
												.catchall(z.any())
										)
										.optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									patch_path: z.union([z.string(), z.null()]).default(null),
									build_path: z.union([z.string(), z.null()]).default(null),
									unrendered_config: z.record(z.any()).optional(),
									created_at: z.number().optional(),
									config_call_dict: z.record(z.any()).optional(),
									unrendered_config_call_dict: z.record(z.any()).optional(),
									relation_name: z.union([z.string(), z.null()]).default(null),
									raw_code: z.string().default(''),
									doc_blocks: z.array(z.string()).optional(),
									language: z.string().default('sql'),
									refs: z
										.array(
											z
												.object({
													name: z.string(),
													package: z.union([z.string(), z.null()]).default(null),
													version: z.union([z.string(), z.number(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									sources: z.array(z.array(z.string())).optional(),
									metrics: z.array(z.array(z.string())).optional(),
									depends_on: z
										.object({
											macros: z.array(z.string()).optional(),
											nodes: z.array(z.string()).optional(),
										})
										.strict()
										.optional(),
									compiled_path: z.union([z.string(), z.null()]).default(null),
									compiled: z.boolean().default(false),
									compiled_code: z.union([z.string(), z.null()]).default(null),
									extra_ctes_injected: z.boolean().default(false),
									extra_ctes: z
										.array(z.object({ id: z.string(), sql: z.string() }).strict())
										.optional(),
									_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
											checksum: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
								})
								.strict(),
							z
								.object({
									database: z.union([z.string(), z.null()]),
									schema: z.string(),
									name: z.string(),
									resource_type: z.literal('test'),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									alias: z.string(),
									checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											alias: z.union([z.string(), z.null()]).default(null),
											schema: z.union([z.string(), z.null()]).default('dbt_test__audit'),
											database: z.union([z.string(), z.null()]).default(null),
											tags: z.union([z.array(z.string()), z.string()]).optional(),
											meta: z.record(z.any()).optional(),
											group: z.union([z.string(), z.null()]).default(null),
											materialized: z.string().default('test'),
											severity: z
												.string()
												.regex(new RegExp('^([Ww][Aa][Rr][Nn]|[Ee][Rr][Rr][Oo][Rr])$'))
												.default('ERROR'),
											store_failures: z.union([z.boolean(), z.null()]).default(null),
											store_failures_as: z.union([z.string(), z.null()]).default(null),
											where: z.union([z.string(), z.null()]).default(null),
											limit: z.union([z.number().int(), z.null()]).default(null),
											fail_calc: z.string().default('count(*)'),
											warn_if: z.string().default('!= 0'),
											error_if: z.string().default('!= 0'),
										})
										.catchall(z.any())
										.optional(),
									tags: z.array(z.string()).optional(),
									description: z.string().default(''),
									columns: z
										.record(
											z
												.object({
													name: z.string(),
													description: z.string().default(''),
													meta: z.record(z.any()).optional(),
													data_type: z.union([z.string(), z.null()]).default(null),
													constraints: z
														.array(
															z
																.object({
																	type: z.enum([
																		'check',
																		'not_null',
																		'unique',
																		'primary_key',
																		'foreign_key',
																		'custom',
																	]),
																	name: z.union([z.string(), z.null()]).default(null),
																	expression: z.union([z.string(), z.null()]).default(null),
																	warn_unenforced: z.boolean().default(true),
																	warn_unsupported: z.boolean().default(true),
																	to: z.union([z.string(), z.null()]).default(null),
																	to_columns: z.array(z.string()).optional(),
																})
																.strict()
														)
														.optional(),
													quote: z.union([z.boolean(), z.null()]).default(null),
													config: z
														.object({
															_extra: z.record(z.any()).optional(),
															meta: z.record(z.any()).optional(),
															tags: z.array(z.string()).optional(),
														})
														.catchall(z.any())
														.optional(),
													tags: z.array(z.string()).optional(),
													_extra: z.record(z.any()).optional(),
													granularity: z
														.union([
															z.enum([
																'nanosecond',
																'microsecond',
																'millisecond',
																'second',
																'minute',
																'hour',
																'day',
																'week',
																'month',
																'quarter',
																'year',
															]),
															z.null(),
														])
														.default(null),
													doc_blocks: z.array(z.string()).optional(),
												})
												.catchall(z.any())
										)
										.optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									patch_path: z.union([z.string(), z.null()]).default(null),
									build_path: z.union([z.string(), z.null()]).default(null),
									unrendered_config: z.record(z.any()).optional(),
									created_at: z.number().optional(),
									config_call_dict: z.record(z.any()).optional(),
									unrendered_config_call_dict: z.record(z.any()).optional(),
									relation_name: z.union([z.string(), z.null()]).default(null),
									raw_code: z.string().default(''),
									doc_blocks: z.array(z.string()).optional(),
									language: z.string().default('sql'),
									refs: z
										.array(
											z
												.object({
													name: z.string(),
													package: z.union([z.string(), z.null()]).default(null),
													version: z.union([z.string(), z.number(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									sources: z.array(z.array(z.string())).optional(),
									metrics: z.array(z.array(z.string())).optional(),
									depends_on: z
										.object({
											macros: z.array(z.string()).optional(),
											nodes: z.array(z.string()).optional(),
										})
										.strict()
										.optional(),
									compiled_path: z.union([z.string(), z.null()]).default(null),
									compiled: z.boolean().default(false),
									compiled_code: z.union([z.string(), z.null()]).default(null),
									extra_ctes_injected: z.boolean().default(false),
									extra_ctes: z
										.array(z.object({ id: z.string(), sql: z.string() }).strict())
										.optional(),
									_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
											checksum: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									column_name: z.union([z.string(), z.null()]).default(null),
									file_key_name: z.union([z.string(), z.null()]).default(null),
									attached_node: z.union([z.string(), z.null()]).default(null),
									test_metadata: z
										.object({
											name: z.string().default('test'),
											kwargs: z.record(z.any()).optional(),
											namespace: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
								})
								.strict(),
							z
								.object({
									database: z.union([z.string(), z.null()]),
									schema: z.string(),
									name: z.string(),
									resource_type: z.literal('snapshot'),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									alias: z.string(),
									checksum: z.object({ name: z.string(), checksum: z.string() }).strict(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											alias: z.union([z.string(), z.null()]).default(null),
											schema: z.union([z.string(), z.null()]).default(null),
											database: z.union([z.string(), z.null()]).default(null),
											tags: z.union([z.array(z.string()), z.string()]).optional(),
											meta: z.record(z.any()).optional(),
											group: z.union([z.string(), z.null()]).default(null),
											materialized: z.string().default('snapshot'),
											incremental_strategy: z.union([z.string(), z.null()]).default(null),
											batch_size: z.any().default(null),
											lookback: z.any().default(1),
											begin: z.any().default(null),
											persist_docs: z.record(z.any()).optional(),
											'post-hook': z
												.array(
													z
														.object({
															sql: z.string(),
															transaction: z.boolean().default(true),
															index: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											'pre-hook': z
												.array(
													z
														.object({
															sql: z.string(),
															transaction: z.boolean().default(true),
															index: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											quoting: z.record(z.any()).optional(),
											column_types: z.record(z.any()).optional(),
											full_refresh: z.union([z.boolean(), z.null()]).default(null),
											unique_key: z
												.union([z.string(), z.array(z.string()), z.null()])
												.default(null),
											on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
											on_configuration_change: z.enum(['apply', 'continue', 'fail']).optional(),
											grants: z.record(z.any()).optional(),
											packages: z.array(z.string()).optional(),
											docs: z
												.object({
													show: z.boolean().default(true),
													node_color: z.union([z.string(), z.null()]).default(null),
												})
												.strict()
												.optional(),
											contract: z
												.object({
													enforced: z.boolean().default(false),
													alias_types: z.boolean().default(true),
												})
												.strict()
												.optional(),
											event_time: z.any().default(null),
											concurrent_batches: z.any().default(null),
											strategy: z.union([z.string(), z.null()]).default(null),
											target_schema: z.union([z.string(), z.null()]).default(null),
											target_database: z.union([z.string(), z.null()]).default(null),
											updated_at: z.union([z.string(), z.null()]).default(null),
											check_cols: z
												.union([z.string(), z.array(z.string()), z.null()])
												.default(null),
											snapshot_meta_column_names: z
												.object({
													dbt_valid_to: z.union([z.string(), z.null()]).default(null),
													dbt_valid_from: z.union([z.string(), z.null()]).default(null),
													dbt_scd_id: z.union([z.string(), z.null()]).default(null),
													dbt_updated_at: z.union([z.string(), z.null()]).default(null),
													dbt_is_deleted: z.union([z.string(), z.null()]).default(null),
												})
												.strict()
												.optional(),
											dbt_valid_to_current: z.union([z.string(), z.null()]).default(null),
										})
										.catchall(z.any()),
									tags: z.array(z.string()).optional(),
									description: z.string().default(''),
									columns: z
										.record(
											z
												.object({
													name: z.string(),
													description: z.string().default(''),
													meta: z.record(z.any()).optional(),
													data_type: z.union([z.string(), z.null()]).default(null),
													constraints: z
														.array(
															z
																.object({
																	type: z.enum([
																		'check',
																		'not_null',
																		'unique',
																		'primary_key',
																		'foreign_key',
																		'custom',
																	]),
																	name: z.union([z.string(), z.null()]).default(null),
																	expression: z.union([z.string(), z.null()]).default(null),
																	warn_unenforced: z.boolean().default(true),
																	warn_unsupported: z.boolean().default(true),
																	to: z.union([z.string(), z.null()]).default(null),
																	to_columns: z.array(z.string()).optional(),
																})
																.strict()
														)
														.optional(),
													quote: z.union([z.boolean(), z.null()]).default(null),
													config: z
														.object({
															_extra: z.record(z.any()).optional(),
															meta: z.record(z.any()).optional(),
															tags: z.array(z.string()).optional(),
														})
														.catchall(z.any())
														.optional(),
													tags: z.array(z.string()).optional(),
													_extra: z.record(z.any()).optional(),
													granularity: z
														.union([
															z.enum([
																'nanosecond',
																'microsecond',
																'millisecond',
																'second',
																'minute',
																'hour',
																'day',
																'week',
																'month',
																'quarter',
																'year',
															]),
															z.null(),
														])
														.default(null),
													doc_blocks: z.array(z.string()).optional(),
												})
												.catchall(z.any())
										)
										.optional(),
									meta: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									docs: z
										.object({
											show: z.boolean().default(true),
											node_color: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									patch_path: z.union([z.string(), z.null()]).default(null),
									build_path: z.union([z.string(), z.null()]).default(null),
									unrendered_config: z.record(z.any()).optional(),
									created_at: z.number().optional(),
									config_call_dict: z.record(z.any()).optional(),
									unrendered_config_call_dict: z.record(z.any()).optional(),
									relation_name: z.union([z.string(), z.null()]).default(null),
									raw_code: z.string().default(''),
									doc_blocks: z.array(z.string()).optional(),
									language: z.string().default('sql'),
									refs: z
										.array(
											z
												.object({
													name: z.string(),
													package: z.union([z.string(), z.null()]).default(null),
													version: z.union([z.string(), z.number(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									sources: z.array(z.array(z.string())).optional(),
									metrics: z.array(z.array(z.string())).optional(),
									depends_on: z
										.object({
											macros: z.array(z.string()).optional(),
											nodes: z.array(z.string()).optional(),
										})
										.strict()
										.optional(),
									compiled_path: z.union([z.string(), z.null()]).default(null),
									compiled: z.boolean().default(false),
									compiled_code: z.union([z.string(), z.null()]).default(null),
									extra_ctes_injected: z.boolean().default(false),
									extra_ctes: z
										.array(z.object({ id: z.string(), sql: z.string() }).strict())
										.optional(),
									_pre_injected_sql: z.union([z.string(), z.null()]).default(null),
									contract: z
										.object({
											enforced: z.boolean().default(false),
											alias_types: z.boolean().default(true),
											checksum: z.union([z.string(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									defer_relation: z
										.union([
											z
												.object({
													database: z.union([z.string(), z.null()]),
													schema: z.string(),
													alias: z.string(),
													relation_name: z.union([z.string(), z.null()]),
													resource_type: z.enum([
														'model',
														'analysis',
														'test',
														'snapshot',
														'operation',
														'seed',
														'rpc',
														'sql_operation',
														'doc',
														'source',
														'macro',
														'exposure',
														'metric',
														'group',
														'saved_query',
														'semantic_model',
														'unit_test',
														'fixture',
													]),
													name: z.string(),
													description: z.string(),
													compiled_code: z.union([z.string(), z.null()]),
													meta: z.record(z.any()),
													tags: z.array(z.string()),
													config: z.union([
														z
															.object({
																_extra: z.record(z.any()).optional(),
																enabled: z.boolean().default(true),
																alias: z.union([z.string(), z.null()]).default(null),
																schema: z.union([z.string(), z.null()]).default(null),
																database: z.union([z.string(), z.null()]).default(null),
																tags: z.union([z.array(z.string()), z.string()]).optional(),
																meta: z.record(z.any()).optional(),
																group: z.union([z.string(), z.null()]).default(null),
																materialized: z.string().default('view'),
																incremental_strategy: z.union([z.string(), z.null()]).default(null),
																batch_size: z.any().default(null),
																lookback: z.any().default(1),
																begin: z.any().default(null),
																persist_docs: z.record(z.any()).optional(),
																'post-hook': z
																	.array(
																		z
																			.object({
																				sql: z.string(),
																				transaction: z.boolean().default(true),
																				index: z.union([z.number().int(), z.null()]).default(null),
																			})
																			.strict()
																	)
																	.optional(),
																'pre-hook': z
																	.array(
																		z
																			.object({
																				sql: z.string(),
																				transaction: z.boolean().default(true),
																				index: z.union([z.number().int(), z.null()]).default(null),
																			})
																			.strict()
																	)
																	.optional(),
																quoting: z.record(z.any()).optional(),
																column_types: z.record(z.any()).optional(),
																full_refresh: z.union([z.boolean(), z.null()]).default(null),
																unique_key: z
																	.union([z.string(), z.array(z.string()), z.null()])
																	.default(null),
																on_schema_change: z.union([z.string(), z.null()]).default('ignore'),
																on_configuration_change: z
																	.enum(['apply', 'continue', 'fail'])
																	.optional(),
																grants: z.record(z.any()).optional(),
																packages: z.array(z.string()).optional(),
																docs: z
																	.object({
																		show: z.boolean().default(true),
																		node_color: z.union([z.string(), z.null()]).default(null),
																	})
																	.strict()
																	.optional(),
																contract: z
																	.object({
																		enforced: z.boolean().default(false),
																		alias_types: z.boolean().default(true),
																	})
																	.strict()
																	.optional(),
																event_time: z.any().default(null),
																concurrent_batches: z.any().default(null),
															})
															.catchall(z.any()),
														z.null(),
													]),
												})
												.strict(),
											z.null(),
										])
										.default(null),
								})
								.strict(),
							z
								.object({
									database: z.union([z.string(), z.null()]),
									schema: z.string(),
									name: z.string(),
									resource_type: z.literal('source'),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									source_name: z.string(),
									source_description: z.string(),
									loader: z.string(),
									identifier: z.string(),
									quoting: z
										.object({
											database: z.union([z.boolean(), z.null()]).default(null),
											schema: z.union([z.boolean(), z.null()]).default(null),
											identifier: z.union([z.boolean(), z.null()]).default(null),
											column: z.union([z.boolean(), z.null()]).default(null),
										})
										.strict()
										.optional(),
									loaded_at_field: z.union([z.string(), z.null()]).default(null),
									loaded_at_query: z.union([z.string(), z.null()]).default(null),
									freshness: z
										.union([
											z
												.object({
													warn_after: z
														.union([
															z
																.object({
																	count: z.union([z.number().int(), z.null()]).default(null),
																	period: z
																		.union([z.enum(['minute', 'hour', 'day']), z.null()])
																		.default(null),
																})
																.strict(),
															z.null(),
														])
														.optional(),
													error_after: z
														.union([
															z
																.object({
																	count: z.union([z.number().int(), z.null()]).default(null),
																	period: z
																		.union([z.enum(['minute', 'hour', 'day']), z.null()])
																		.default(null),
																})
																.strict(),
															z.null(),
														])
														.optional(),
													filter: z.union([z.string(), z.null()]).default(null),
												})
												.strict(),
											z.null(),
										])
										.default(null),
									external: z
										.union([
											z
												.object({
													_extra: z.record(z.any()).optional(),
													location: z.union([z.string(), z.null()]).default(null),
													file_format: z.union([z.string(), z.null()]).default(null),
													row_format: z.union([z.string(), z.null()]).default(null),
													tbl_properties: z.union([z.string(), z.null()]).default(null),
													partitions: z
														.union([
															z.array(z.string()),
															z.array(
																z
																	.object({
																		_extra: z.record(z.any()).optional(),
																		name: z.string().default(''),
																		description: z.string().default(''),
																		data_type: z.string().default(''),
																		meta: z.record(z.any()).optional(),
																	})
																	.catchall(z.any())
															),
															z.null(),
														])
														.default(null),
												})
												.catchall(z.any()),
											z.null(),
										])
										.default(null),
									description: z.string().default(''),
									columns: z
										.record(
											z
												.object({
													name: z.string(),
													description: z.string().default(''),
													meta: z.record(z.any()).optional(),
													data_type: z.union([z.string(), z.null()]).default(null),
													constraints: z
														.array(
															z
																.object({
																	type: z.enum([
																		'check',
																		'not_null',
																		'unique',
																		'primary_key',
																		'foreign_key',
																		'custom',
																	]),
																	name: z.union([z.string(), z.null()]).default(null),
																	expression: z.union([z.string(), z.null()]).default(null),
																	warn_unenforced: z.boolean().default(true),
																	warn_unsupported: z.boolean().default(true),
																	to: z.union([z.string(), z.null()]).default(null),
																	to_columns: z.array(z.string()).optional(),
																})
																.strict()
														)
														.optional(),
													quote: z.union([z.boolean(), z.null()]).default(null),
													config: z
														.object({
															_extra: z.record(z.any()).optional(),
															meta: z.record(z.any()).optional(),
															tags: z.array(z.string()).optional(),
														})
														.catchall(z.any())
														.optional(),
													tags: z.array(z.string()).optional(),
													_extra: z.record(z.any()).optional(),
													granularity: z
														.union([
															z.enum([
																'nanosecond',
																'microsecond',
																'millisecond',
																'second',
																'minute',
																'hour',
																'day',
																'week',
																'month',
																'quarter',
																'year',
															]),
															z.null(),
														])
														.default(null),
													doc_blocks: z.array(z.string()).optional(),
												})
												.catchall(z.any())
										)
										.optional(),
									meta: z.record(z.any()).optional(),
									source_meta: z.record(z.any()).optional(),
									tags: z.array(z.string()).optional(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											event_time: z.any().default(null),
											freshness: z
												.union([
													z
														.object({
															warn_after: z
																.union([
																	z
																		.object({
																			count: z.union([z.number().int(), z.null()]).default(null),
																			period: z
																				.union([z.enum(['minute', 'hour', 'day']), z.null()])
																				.default(null),
																		})
																		.strict(),
																	z.null(),
																])
																.optional(),
															error_after: z
																.union([
																	z
																		.object({
																			count: z.union([z.number().int(), z.null()]).default(null),
																			period: z
																				.union([z.enum(['minute', 'hour', 'day']), z.null()])
																				.default(null),
																		})
																		.strict(),
																	z.null(),
																])
																.optional(),
															filter: z.union([z.string(), z.null()]).default(null),
														})
														.strict(),
													z.null(),
												])
												.optional(),
											loaded_at_field: z.union([z.string(), z.null()]).default(null),
											loaded_at_query: z.union([z.string(), z.null()]).default(null),
											meta: z.record(z.any()).optional(),
											tags: z.array(z.string()).optional(),
										})
										.catchall(z.any())
										.optional(),
									patch_path: z.union([z.string(), z.null()]).default(null),
									unrendered_config: z.record(z.any()).optional(),
									relation_name: z.union([z.string(), z.null()]).default(null),
									created_at: z.number().optional(),
									unrendered_database: z.union([z.string(), z.null()]).default(null),
									unrendered_schema: z.union([z.string(), z.null()]).default(null),
									doc_blocks: z.array(z.string()).optional(),
								})
								.strict(),
							z
								.object({
									name: z.string(),
									resource_type: z.literal('exposure'),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									type: z.enum(['dashboard', 'notebook', 'analysis', 'ml', 'application']),
									owner: z
										.object({
											_extra: z.record(z.any()).optional(),
											email: z.union([z.string(), z.array(z.string()), z.null()]).default(null),
											name: z.union([z.string(), z.null()]).default(null),
										})
										.catchall(z.any()),
									description: z.string().default(''),
									label: z.union([z.string(), z.null()]).default(null),
									maturity: z.union([z.enum(['low', 'medium', 'high']), z.null()]).default(null),
									meta: z.record(z.any()).optional(),
									tags: z.array(z.string()).optional(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											tags: z.array(z.string()).optional(),
											meta: z.record(z.any()).optional(),
										})
										.catchall(z.any())
										.optional(),
									unrendered_config: z.record(z.any()).optional(),
									url: z.union([z.string(), z.null()]).default(null),
									depends_on: z
										.object({
											macros: z.array(z.string()).optional(),
											nodes: z.array(z.string()).optional(),
										})
										.strict()
										.optional(),
									refs: z
										.array(
											z
												.object({
													name: z.string(),
													package: z.union([z.string(), z.null()]).default(null),
													version: z.union([z.string(), z.number(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									sources: z.array(z.array(z.string())).optional(),
									metrics: z.array(z.array(z.string())).optional(),
									created_at: z.number().optional(),
								})
								.strict(),
							z
								.object({
									name: z.string(),
									resource_type: z.literal('metric'),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									description: z.string(),
									label: z.string(),
									type: z.enum(['simple', 'ratio', 'cumulative', 'derived', 'conversion']),
									type_params: z
										.object({
											measure: z
												.union([
													z
														.object({
															name: z.string(),
															filter: z
																.union([
																	z
																		.object({
																			where_filters: z.array(
																				z.object({ where_sql_template: z.string() }).strict()
																			),
																		})
																		.strict(),
																	z.null(),
																])
																.default(null),
															alias: z.union([z.string(), z.null()]).default(null),
															join_to_timespine: z.boolean().default(false),
															fill_nulls_with: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict(),
													z.null(),
												])
												.default(null),
											input_measures: z
												.array(
													z
														.object({
															name: z.string(),
															filter: z
																.union([
																	z
																		.object({
																			where_filters: z.array(
																				z.object({ where_sql_template: z.string() }).strict()
																			),
																		})
																		.strict(),
																	z.null(),
																])
																.default(null),
															alias: z.union([z.string(), z.null()]).default(null),
															join_to_timespine: z.boolean().default(false),
															fill_nulls_with: z.union([z.number().int(), z.null()]).default(null),
														})
														.strict()
												)
												.optional(),
											numerator: z
												.union([
													z
														.object({
															name: z.string(),
															filter: z
																.union([
																	z
																		.object({
																			where_filters: z.array(
																				z.object({ where_sql_template: z.string() }).strict()
																			),
																		})
																		.strict(),
																	z.null(),
																])
																.default(null),
															alias: z.union([z.string(), z.null()]).default(null),
															offset_window: z
																.union([
																	z
																		.object({ count: z.number().int(), granularity: z.string() })
																		.strict(),
																	z.null(),
																])
																.default(null),
															offset_to_grain: z.union([z.string(), z.null()]).default(null),
														})
														.strict(),
													z.null(),
												])
												.default(null),
											denominator: z
												.union([
													z
														.object({
															name: z.string(),
															filter: z
																.union([
																	z
																		.object({
																			where_filters: z.array(
																				z.object({ where_sql_template: z.string() }).strict()
																			),
																		})
																		.strict(),
																	z.null(),
																])
																.default(null),
															alias: z.union([z.string(), z.null()]).default(null),
															offset_window: z
																.union([
																	z
																		.object({ count: z.number().int(), granularity: z.string() })
																		.strict(),
																	z.null(),
																])
																.default(null),
															offset_to_grain: z.union([z.string(), z.null()]).default(null),
														})
														.strict(),
													z.null(),
												])
												.default(null),
											expr: z.union([z.string(), z.null()]).default(null),
											window: z
												.union([
													z.object({ count: z.number().int(), granularity: z.string() }).strict(),
													z.null(),
												])
												.default(null),
											grain_to_date: z
												.union([
													z.enum([
														'nanosecond',
														'microsecond',
														'millisecond',
														'second',
														'minute',
														'hour',
														'day',
														'week',
														'month',
														'quarter',
														'year',
													]),
													z.null(),
												])
												.default(null),
											metrics: z
												.union([
													z.array(
														z
															.object({
																name: z.string(),
																filter: z
																	.union([
																		z
																			.object({
																				where_filters: z.array(
																					z.object({ where_sql_template: z.string() }).strict()
																				),
																			})
																			.strict(),
																		z.null(),
																	])
																	.default(null),
																alias: z.union([z.string(), z.null()]).default(null),
																offset_window: z
																	.union([
																		z
																			.object({ count: z.number().int(), granularity: z.string() })
																			.strict(),
																		z.null(),
																	])
																	.default(null),
																offset_to_grain: z.union([z.string(), z.null()]).default(null),
															})
															.strict()
													),
													z.null(),
												])
												.default(null),
											conversion_type_params: z
												.union([
													z
														.object({
															base_measure: z
																.object({
																	name: z.string(),
																	filter: z
																		.union([
																			z
																				.object({
																					where_filters: z.array(
																						z.object({ where_sql_template: z.string() }).strict()
																					),
																				})
																				.strict(),
																			z.null(),
																		])
																		.default(null),
																	alias: z.union([z.string(), z.null()]).default(null),
																	join_to_timespine: z.boolean().default(false),
																	fill_nulls_with: z
																		.union([z.number().int(), z.null()])
																		.default(null),
																})
																.strict(),
															conversion_measure: z
																.object({
																	name: z.string(),
																	filter: z
																		.union([
																			z
																				.object({
																					where_filters: z.array(
																						z.object({ where_sql_template: z.string() }).strict()
																					),
																				})
																				.strict(),
																			z.null(),
																		])
																		.default(null),
																	alias: z.union([z.string(), z.null()]).default(null),
																	join_to_timespine: z.boolean().default(false),
																	fill_nulls_with: z
																		.union([z.number().int(), z.null()])
																		.default(null),
																})
																.strict(),
															entity: z.string(),
															calculation: z
																.enum(['conversions', 'conversion_rate'])
																.default('conversion_rate'),
															window: z
																.union([
																	z
																		.object({ count: z.number().int(), granularity: z.string() })
																		.strict(),
																	z.null(),
																])
																.default(null),
															constant_properties: z
																.union([
																	z.array(
																		z
																			.object({
																				base_property: z.string(),
																				conversion_property: z.string(),
																			})
																			.strict()
																	),
																	z.null(),
																])
																.default(null),
														})
														.strict(),
													z.null(),
												])
												.default(null),
											cumulative_type_params: z
												.union([
													z
														.object({
															window: z
																.union([
																	z
																		.object({ count: z.number().int(), granularity: z.string() })
																		.strict(),
																	z.null(),
																])
																.default(null),
															grain_to_date: z.union([z.string(), z.null()]).default(null),
															period_agg: z.enum(['first', 'last', 'average']).default('first'),
														})
														.strict(),
													z.null(),
												])
												.default(null),
										})
										.strict(),
									filter: z
										.union([
											z
												.object({
													where_filters: z.array(
														z.object({ where_sql_template: z.string() }).strict()
													),
												})
												.strict(),
											z.null(),
										])
										.default(null),
									metadata: z
										.union([
											z
												.object({
													repo_file_path: z.string(),
													file_slice: z
														.object({
															filename: z.string(),
															content: z.string(),
															start_line_number: z.number().int(),
															end_line_number: z.number().int(),
														})
														.strict(),
												})
												.strict(),
											z.null(),
										])
										.default(null),
									time_granularity: z.union([z.string(), z.null()]).default(null),
									meta: z.record(z.any()).optional(),
									tags: z.array(z.string()).optional(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											group: z.union([z.string(), z.null()]).default(null),
											meta: z.record(z.any()).optional(),
										})
										.catchall(z.any())
										.optional(),
									unrendered_config: z.record(z.any()).optional(),
									sources: z.array(z.array(z.string())).optional(),
									depends_on: z
										.object({
											macros: z.array(z.string()).optional(),
											nodes: z.array(z.string()).optional(),
										})
										.strict()
										.optional(),
									refs: z
										.array(
											z
												.object({
													name: z.string(),
													package: z.union([z.string(), z.null()]).default(null),
													version: z.union([z.string(), z.number(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									metrics: z.array(z.array(z.string())).optional(),
									created_at: z.number().optional(),
									group: z.union([z.string(), z.null()]).default(null),
								})
								.strict(),
							z
								.object({
									name: z.string(),
									resource_type: z.literal('saved_query'),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									query_params: z
										.object({
											metrics: z.array(z.string()),
											group_by: z.array(z.string()),
											where: z.union([
												z
													.object({
														where_filters: z.array(
															z.object({ where_sql_template: z.string() }).strict()
														),
													})
													.strict(),
												z.null(),
											]),
											order_by: z.array(z.string()).optional(),
											limit: z.union([z.number().int(), z.null()]).default(null),
										})
										.strict(),
									exports: z.array(
										z
											.object({
												name: z.string(),
												config: z
													.object({
														export_as: z.enum(['table', 'view']),
														schema_name: z.union([z.string(), z.null()]).default(null),
														alias: z.union([z.string(), z.null()]).default(null),
														database: z.union([z.string(), z.null()]).default(null),
													})
													.strict(),
												unrendered_config: z.record(z.string()).optional(),
											})
											.strict()
									),
									description: z.union([z.string(), z.null()]).default(null),
									label: z.union([z.string(), z.null()]).default(null),
									metadata: z
										.union([
											z
												.object({
													repo_file_path: z.string(),
													file_slice: z
														.object({
															filename: z.string(),
															content: z.string(),
															start_line_number: z.number().int(),
															end_line_number: z.number().int(),
														})
														.strict(),
												})
												.strict(),
											z.null(),
										])
										.default(null),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											group: z.union([z.string(), z.null()]).default(null),
											meta: z.record(z.any()).optional(),
											export_as: z.union([z.enum(['table', 'view']), z.null()]).default(null),
											schema: z.union([z.string(), z.null()]).default(null),
											cache: z
												.object({ enabled: z.boolean().default(false) })
												.strict()
												.optional(),
										})
										.catchall(z.any())
										.optional(),
									unrendered_config: z.record(z.any()).optional(),
									group: z.union([z.string(), z.null()]).default(null),
									depends_on: z
										.object({
											macros: z.array(z.string()).optional(),
											nodes: z.array(z.string()).optional(),
										})
										.strict()
										.optional(),
									created_at: z.number().optional(),
									refs: z
										.array(
											z
												.object({
													name: z.string(),
													package: z.union([z.string(), z.null()]).default(null),
													version: z.union([z.string(), z.number(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									tags: z.union([z.array(z.string()), z.string()]).optional(),
								})
								.strict(),
							z
								.object({
									name: z.string(),
									resource_type: z.enum([
										'model',
										'analysis',
										'test',
										'snapshot',
										'operation',
										'seed',
										'rpc',
										'sql_operation',
										'doc',
										'source',
										'macro',
										'exposure',
										'metric',
										'group',
										'saved_query',
										'semantic_model',
										'unit_test',
										'fixture',
									]),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									model: z.string(),
									node_relation: z.union([
										z
											.object({
												alias: z.string(),
												schema_name: z.string(),
												database: z.union([z.string(), z.null()]).default(null),
												relation_name: z.union([z.string(), z.null()]).default(''),
											})
											.strict(),
										z.null(),
									]),
									description: z.union([z.string(), z.null()]).default(null),
									label: z.union([z.string(), z.null()]).default(null),
									defaults: z
										.union([
											z
												.object({
													agg_time_dimension: z.union([z.string(), z.null()]).default(null),
												})
												.strict(),
											z.null(),
										])
										.default(null),
									entities: z
										.array(
											z
												.object({
													name: z.string(),
													type: z.enum(['foreign', 'natural', 'primary', 'unique']),
													description: z.union([z.string(), z.null()]).default(null),
													label: z.union([z.string(), z.null()]).default(null),
													role: z.union([z.string(), z.null()]).default(null),
													expr: z.union([z.string(), z.null()]).default(null),
													config: z
														.union([
															z.object({ meta: z.record(z.any()).optional() }).strict(),
															z.null(),
														])
														.default(null),
												})
												.strict()
										)
										.optional(),
									measures: z
										.array(
											z
												.object({
													name: z.string(),
													agg: z.enum([
														'sum',
														'min',
														'max',
														'count_distinct',
														'sum_boolean',
														'average',
														'percentile',
														'median',
														'count',
													]),
													description: z.union([z.string(), z.null()]).default(null),
													label: z.union([z.string(), z.null()]).default(null),
													create_metric: z.boolean().default(false),
													expr: z.union([z.string(), z.null()]).default(null),
													agg_params: z
														.union([
															z
																.object({
																	percentile: z.union([z.number(), z.null()]).default(null),
																	use_discrete_percentile: z.boolean().default(false),
																	use_approximate_percentile: z.boolean().default(false),
																})
																.strict(),
															z.null(),
														])
														.default(null),
													non_additive_dimension: z
														.union([
															z
																.object({
																	name: z.string(),
																	window_choice: z.enum([
																		'sum',
																		'min',
																		'max',
																		'count_distinct',
																		'sum_boolean',
																		'average',
																		'percentile',
																		'median',
																		'count',
																	]),
																	window_groupings: z.array(z.string()),
																})
																.strict(),
															z.null(),
														])
														.default(null),
													agg_time_dimension: z.union([z.string(), z.null()]).default(null),
													config: z
														.union([
															z.object({ meta: z.record(z.any()).optional() }).strict(),
															z.null(),
														])
														.default(null),
												})
												.strict()
										)
										.optional(),
									dimensions: z
										.array(
											z
												.object({
													name: z.string(),
													type: z.enum(['categorical', 'time']),
													description: z.union([z.string(), z.null()]).default(null),
													label: z.union([z.string(), z.null()]).default(null),
													is_partition: z.boolean().default(false),
													type_params: z
														.union([
															z
																.object({
																	time_granularity: z.enum([
																		'nanosecond',
																		'microsecond',
																		'millisecond',
																		'second',
																		'minute',
																		'hour',
																		'day',
																		'week',
																		'month',
																		'quarter',
																		'year',
																	]),
																	validity_params: z
																		.union([
																			z
																				.object({
																					is_start: z.boolean().default(false),
																					is_end: z.boolean().default(false),
																				})
																				.strict(),
																			z.null(),
																		])
																		.default(null),
																})
																.strict(),
															z.null(),
														])
														.default(null),
													expr: z.union([z.string(), z.null()]).default(null),
													metadata: z
														.union([
															z
																.object({
																	repo_file_path: z.string(),
																	file_slice: z
																		.object({
																			filename: z.string(),
																			content: z.string(),
																			start_line_number: z.number().int(),
																			end_line_number: z.number().int(),
																		})
																		.strict(),
																})
																.strict(),
															z.null(),
														])
														.default(null),
													config: z
														.union([
															z.object({ meta: z.record(z.any()).optional() }).strict(),
															z.null(),
														])
														.default(null),
												})
												.strict()
										)
										.optional(),
									metadata: z
										.union([
											z
												.object({
													repo_file_path: z.string(),
													file_slice: z
														.object({
															filename: z.string(),
															content: z.string(),
															start_line_number: z.number().int(),
															end_line_number: z.number().int(),
														})
														.strict(),
												})
												.strict(),
											z.null(),
										])
										.default(null),
									depends_on: z
										.object({
											macros: z.array(z.string()).optional(),
											nodes: z.array(z.string()).optional(),
										})
										.strict()
										.optional(),
									refs: z
										.array(
											z
												.object({
													name: z.string(),
													package: z.union([z.string(), z.null()]).default(null),
													version: z.union([z.string(), z.number(), z.null()]).default(null),
												})
												.strict()
										)
										.optional(),
									created_at: z.number().optional(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
											group: z.union([z.string(), z.null()]).default(null),
											meta: z.record(z.any()).optional(),
										})
										.catchall(z.any())
										.optional(),
									unrendered_config: z.record(z.any()).optional(),
									primary_entity: z.union([z.string(), z.null()]).default(null),
									group: z.union([z.string(), z.null()]).default(null),
								})
								.strict(),
							z
								.object({
									model: z.string(),
									given: z.array(
										z
											.object({
												input: z.string(),
												rows: z
													.union([z.string(), z.array(z.record(z.any())), z.null()])
													.default(null),
												format: z.enum(['csv', 'dict', 'sql']).default('dict'),
												fixture: z.union([z.string(), z.null()]).default(null),
											})
											.strict()
									),
									expect: z
										.object({
											rows: z
												.union([z.string(), z.array(z.record(z.any())), z.null()])
												.default(null),
											format: z.enum(['csv', 'dict', 'sql']).default('dict'),
											fixture: z.union([z.string(), z.null()]).default(null),
										})
										.strict(),
									name: z.string(),
									resource_type: z.enum([
										'model',
										'analysis',
										'test',
										'snapshot',
										'operation',
										'seed',
										'rpc',
										'sql_operation',
										'doc',
										'source',
										'macro',
										'exposure',
										'metric',
										'group',
										'saved_query',
										'semantic_model',
										'unit_test',
										'fixture',
									]),
									package_name: z.string(),
									path: z.string(),
									original_file_path: z.string(),
									unique_id: z.string(),
									fqn: z.array(z.string()),
									description: z.string().default(''),
									overrides: z
										.union([
											z
												.object({
													macros: z.record(z.any()).optional(),
													vars: z.record(z.any()).optional(),
													env_vars: z.record(z.any()).optional(),
												})
												.strict(),
											z.null(),
										])
										.default(null),
									depends_on: z
										.object({
											macros: z.array(z.string()).optional(),
											nodes: z.array(z.string()).optional(),
										})
										.strict()
										.optional(),
									config: z
										.object({
											_extra: z.record(z.any()).optional(),
											tags: z.union([z.string(), z.array(z.string())]).optional(),
											meta: z.record(z.any()).optional(),
											enabled: z.boolean().default(true),
										})
										.catchall(z.any())
										.optional(),
									checksum: z.union([z.string(), z.null()]).default(null),
									schema: z.union([z.string(), z.null()]).default(null),
									created_at: z.number().optional(),
									versions: z
										.union([
											z
												.object({
													include: z
														.union([z.array(z.union([z.string(), z.number()])), z.null()])
														.default(null),
													exclude: z
														.union([z.array(z.union([z.string(), z.number()])), z.null()])
														.default(null),
												})
												.strict(),
											z.null(),
										])
										.default(null),
									version: z.union([z.string(), z.number(), z.null()]).default(null),
								})
								.strict(),
						])
					)
				),
				z.null(),
			])
			.describe('A mapping of the disabled nodes in the target'),
		/**A mapping from child nodes to their dependencies*/
		parent_map: z
			.union([z.record(z.array(z.string())), z.null()])
			.describe('A mapping from child nodes to their dependencies'),
		/**A mapping from parent nodes to their dependents*/
		child_map: z
			.union([z.record(z.array(z.string())), z.null()])
			.describe('A mapping from parent nodes to their dependents'),
		/**A mapping from group names to their nodes*/
		group_map: z
			.union([z.record(z.array(z.string())), z.null()])
			.describe('A mapping from group names to their nodes'),
		/**The saved queries defined in the dbt project*/
		saved_queries: z
			.record(
				z
					.object({
						name: z.string(),
						resource_type: z.literal('saved_query'),
						package_name: z.string(),
						path: z.string(),
						original_file_path: z.string(),
						unique_id: z.string(),
						fqn: z.array(z.string()),
						query_params: z
							.object({
								metrics: z.array(z.string()),
								group_by: z.array(z.string()),
								where: z.union([
									z
										.object({
											where_filters: z.array(z.object({ where_sql_template: z.string() }).strict()),
										})
										.strict(),
									z.null(),
								]),
								order_by: z.array(z.string()).optional(),
								limit: z.union([z.number().int(), z.null()]).default(null),
							})
							.strict(),
						exports: z.array(
							z
								.object({
									name: z.string(),
									config: z
										.object({
											export_as: z.enum(['table', 'view']),
											schema_name: z.union([z.string(), z.null()]).default(null),
											alias: z.union([z.string(), z.null()]).default(null),
											database: z.union([z.string(), z.null()]).default(null),
										})
										.strict(),
									unrendered_config: z.record(z.string()).optional(),
								})
								.strict()
						),
						description: z.union([z.string(), z.null()]).default(null),
						label: z.union([z.string(), z.null()]).default(null),
						metadata: z
							.union([
								z
									.object({
										repo_file_path: z.string(),
										file_slice: z
											.object({
												filename: z.string(),
												content: z.string(),
												start_line_number: z.number().int(),
												end_line_number: z.number().int(),
											})
											.strict(),
									})
									.strict(),
								z.null(),
							])
							.default(null),
						config: z
							.object({
								_extra: z.record(z.any()).optional(),
								enabled: z.boolean().default(true),
								group: z.union([z.string(), z.null()]).default(null),
								meta: z.record(z.any()).optional(),
								export_as: z.union([z.enum(['table', 'view']), z.null()]).default(null),
								schema: z.union([z.string(), z.null()]).default(null),
								cache: z
									.object({ enabled: z.boolean().default(false) })
									.strict()
									.optional(),
							})
							.catchall(z.any())
							.optional(),
						unrendered_config: z.record(z.any()).optional(),
						group: z.union([z.string(), z.null()]).default(null),
						depends_on: z
							.object({
								macros: z.array(z.string()).optional(),
								nodes: z.array(z.string()).optional(),
							})
							.strict()
							.optional(),
						created_at: z.number().optional(),
						refs: z
							.array(
								z
									.object({
										name: z.string(),
										package: z.union([z.string(), z.null()]).default(null),
										version: z.union([z.string(), z.number(), z.null()]).default(null),
									})
									.strict()
							)
							.optional(),
						tags: z.union([z.array(z.string()), z.string()]).optional(),
					})
					.strict()
			)
			.describe('The saved queries defined in the dbt project'),
		/**The semantic models defined in the dbt project*/
		semantic_models: z
			.record(
				z
					.object({
						name: z.string(),
						resource_type: z.enum([
							'model',
							'analysis',
							'test',
							'snapshot',
							'operation',
							'seed',
							'rpc',
							'sql_operation',
							'doc',
							'source',
							'macro',
							'exposure',
							'metric',
							'group',
							'saved_query',
							'semantic_model',
							'unit_test',
							'fixture',
						]),
						package_name: z.string(),
						path: z.string(),
						original_file_path: z.string(),
						unique_id: z.string(),
						fqn: z.array(z.string()),
						model: z.string(),
						node_relation: z.union([
							z
								.object({
									alias: z.string(),
									schema_name: z.string(),
									database: z.union([z.string(), z.null()]).default(null),
									relation_name: z.union([z.string(), z.null()]).default(''),
								})
								.strict(),
							z.null(),
						]),
						description: z.union([z.string(), z.null()]).default(null),
						label: z.union([z.string(), z.null()]).default(null),
						defaults: z
							.union([
								z
									.object({ agg_time_dimension: z.union([z.string(), z.null()]).default(null) })
									.strict(),
								z.null(),
							])
							.default(null),
						entities: z
							.array(
								z
									.object({
										name: z.string(),
										type: z.enum(['foreign', 'natural', 'primary', 'unique']),
										description: z.union([z.string(), z.null()]).default(null),
										label: z.union([z.string(), z.null()]).default(null),
										role: z.union([z.string(), z.null()]).default(null),
										expr: z.union([z.string(), z.null()]).default(null),
										config: z
											.union([z.object({ meta: z.record(z.any()).optional() }).strict(), z.null()])
											.default(null),
									})
									.strict()
							)
							.optional(),
						measures: z
							.array(
								z
									.object({
										name: z.string(),
										agg: z.enum([
											'sum',
											'min',
											'max',
											'count_distinct',
											'sum_boolean',
											'average',
											'percentile',
											'median',
											'count',
										]),
										description: z.union([z.string(), z.null()]).default(null),
										label: z.union([z.string(), z.null()]).default(null),
										create_metric: z.boolean().default(false),
										expr: z.union([z.string(), z.null()]).default(null),
										agg_params: z
											.union([
												z
													.object({
														percentile: z.union([z.number(), z.null()]).default(null),
														use_discrete_percentile: z.boolean().default(false),
														use_approximate_percentile: z.boolean().default(false),
													})
													.strict(),
												z.null(),
											])
											.default(null),
										non_additive_dimension: z
											.union([
												z
													.object({
														name: z.string(),
														window_choice: z.enum([
															'sum',
															'min',
															'max',
															'count_distinct',
															'sum_boolean',
															'average',
															'percentile',
															'median',
															'count',
														]),
														window_groupings: z.array(z.string()),
													})
													.strict(),
												z.null(),
											])
											.default(null),
										agg_time_dimension: z.union([z.string(), z.null()]).default(null),
										config: z
											.union([z.object({ meta: z.record(z.any()).optional() }).strict(), z.null()])
											.default(null),
									})
									.strict()
							)
							.optional(),
						dimensions: z
							.array(
								z
									.object({
										name: z.string(),
										type: z.enum(['categorical', 'time']),
										description: z.union([z.string(), z.null()]).default(null),
										label: z.union([z.string(), z.null()]).default(null),
										is_partition: z.boolean().default(false),
										type_params: z
											.union([
												z
													.object({
														time_granularity: z.enum([
															'nanosecond',
															'microsecond',
															'millisecond',
															'second',
															'minute',
															'hour',
															'day',
															'week',
															'month',
															'quarter',
															'year',
														]),
														validity_params: z
															.union([
																z
																	.object({
																		is_start: z.boolean().default(false),
																		is_end: z.boolean().default(false),
																	})
																	.strict(),
																z.null(),
															])
															.default(null),
													})
													.strict(),
												z.null(),
											])
											.default(null),
										expr: z.union([z.string(), z.null()]).default(null),
										metadata: z
											.union([
												z
													.object({
														repo_file_path: z.string(),
														file_slice: z
															.object({
																filename: z.string(),
																content: z.string(),
																start_line_number: z.number().int(),
																end_line_number: z.number().int(),
															})
															.strict(),
													})
													.strict(),
												z.null(),
											])
											.default(null),
										config: z
											.union([z.object({ meta: z.record(z.any()).optional() }).strict(), z.null()])
											.default(null),
									})
									.strict()
							)
							.optional(),
						metadata: z
							.union([
								z
									.object({
										repo_file_path: z.string(),
										file_slice: z
											.object({
												filename: z.string(),
												content: z.string(),
												start_line_number: z.number().int(),
												end_line_number: z.number().int(),
											})
											.strict(),
									})
									.strict(),
								z.null(),
							])
							.default(null),
						depends_on: z
							.object({
								macros: z.array(z.string()).optional(),
								nodes: z.array(z.string()).optional(),
							})
							.strict()
							.optional(),
						refs: z
							.array(
								z
									.object({
										name: z.string(),
										package: z.union([z.string(), z.null()]).default(null),
										version: z.union([z.string(), z.number(), z.null()]).default(null),
									})
									.strict()
							)
							.optional(),
						created_at: z.number().optional(),
						config: z
							.object({
								_extra: z.record(z.any()).optional(),
								enabled: z.boolean().default(true),
								group: z.union([z.string(), z.null()]).default(null),
								meta: z.record(z.any()).optional(),
							})
							.catchall(z.any())
							.optional(),
						unrendered_config: z.record(z.any()).optional(),
						primary_entity: z.union([z.string(), z.null()]).default(null),
						group: z.union([z.string(), z.null()]).default(null),
					})
					.strict()
			)
			.describe('The semantic models defined in the dbt project'),
		/**The unit tests defined in the project*/
		unit_tests: z
			.record(
				z
					.object({
						model: z.string(),
						given: z.array(
							z
								.object({
									input: z.string(),
									rows: z.union([z.string(), z.array(z.record(z.any())), z.null()]).default(null),
									format: z.enum(['csv', 'dict', 'sql']).default('dict'),
									fixture: z.union([z.string(), z.null()]).default(null),
								})
								.strict()
						),
						expect: z
							.object({
								rows: z.union([z.string(), z.array(z.record(z.any())), z.null()]).default(null),
								format: z.enum(['csv', 'dict', 'sql']).default('dict'),
								fixture: z.union([z.string(), z.null()]).default(null),
							})
							.strict(),
						name: z.string(),
						resource_type: z.enum([
							'model',
							'analysis',
							'test',
							'snapshot',
							'operation',
							'seed',
							'rpc',
							'sql_operation',
							'doc',
							'source',
							'macro',
							'exposure',
							'metric',
							'group',
							'saved_query',
							'semantic_model',
							'unit_test',
							'fixture',
						]),
						package_name: z.string(),
						path: z.string(),
						original_file_path: z.string(),
						unique_id: z.string(),
						fqn: z.array(z.string()),
						description: z.string().default(''),
						overrides: z
							.union([
								z
									.object({
										macros: z.record(z.any()).optional(),
										vars: z.record(z.any()).optional(),
										env_vars: z.record(z.any()).optional(),
									})
									.strict(),
								z.null(),
							])
							.default(null),
						depends_on: z
							.object({
								macros: z.array(z.string()).optional(),
								nodes: z.array(z.string()).optional(),
							})
							.strict()
							.optional(),
						config: z
							.object({
								_extra: z.record(z.any()).optional(),
								tags: z.union([z.string(), z.array(z.string())]).optional(),
								meta: z.record(z.any()).optional(),
								enabled: z.boolean().default(true),
							})
							.catchall(z.any())
							.optional(),
						checksum: z.union([z.string(), z.null()]).default(null),
						schema: z.union([z.string(), z.null()]).default(null),
						created_at: z.number().optional(),
						versions: z
							.union([
								z
									.object({
										include: z
											.union([z.array(z.union([z.string(), z.number()])), z.null()])
											.default(null),
										exclude: z
											.union([z.array(z.union([z.string(), z.number()])), z.null()])
											.default(null),
									})
									.strict(),
								z.null(),
							])
							.default(null),
						version: z.union([z.string(), z.number(), z.null()]).default(null),
					})
					.strict()
			)
			.describe('The unit tests defined in the project'),
	})
	.strict();
export type DbtManifest = z.infer<typeof dbtManifestSchema>;
