import { AstroError } from 'astro/errors';

import { StarlightDbtOptionsSchema, type StarlightDbtUserOptions } from './config';
import { createProjectService } from './lib/projectService';
import { getDbtArtifactsAbsolutePath, getPageTemplatePath, getDbtSidebar } from './utils';

import type { StarlightPlugin } from '@astrojs/starlight/types';

export type { StarlightDbtOptions } from './config';

export default function starlightDbtPlugin(userOptions?: StarlightDbtUserOptions): StarlightPlugin {
	const options = StarlightDbtOptionsSchema.safeParse(userOptions);

	if (!options.success) {
		throwPluginError('Invalid options passed to the starlight-dbt plugin.');
	}

	const config = options.data;

	return {
		name: 'starlight-dbt-plugin',
		hooks: {
			async 'config:setup'({
				config: starlightConfig,
				updateConfig,
				addIntegration,
				astroConfig,
				logger,
			}) {
				logger.info(`Using manifest: ${config.manifest}`);
				logger.info(`Using catalog: ${config.catalog}`);
				const service = createProjectService(
					getDbtArtifactsAbsolutePath(config.manifest, astroConfig),
					getDbtArtifactsAbsolutePath(config.catalog, astroConfig)
				);
				await service.init();
				service.create_id_map();

				try {
					updateConfig({
						sidebar: getDbtSidebar(
							starlightConfig.sidebar ?? [],
							service,
							config.basePath,
							'Default dbt Project'
						),
						components: {
							...starlightConfig.components,
							Sidebar: 'starlight-dbt/components/DbtSidebar.astro',
						},
					});
				} catch (error) {
					throwPluginError(
						error instanceof Error
							? error.message
							: 'An error occurred while generating dbt sidebars.'
					);
				}

				addIntegration({
					name: 'starlight-dbt-integration',
					hooks: {
						'astro:config:setup': ({ injectRoute, updateConfig }) => {
							injectRoute({
								pattern: `${config.basePath}/[...slug]`,
								entrypoint: getPageTemplatePath(config),
							});

							const virtualModuleId = 'virtual:dbt-data';
							const resolvedVirtualModuleId = '\0' + virtualModuleId;
							updateConfig({
								vite: {
									plugins: [
										{
											name: 'vite-plugin-dbt-data',
											resolveId(id) {
												if (id === virtualModuleId) return resolvedVirtualModuleId;
												return null;
											},
											load(id) {
												if (id === resolvedVirtualModuleId) {
													return `export const dbtData = ${JSON.stringify(service)};`;
												}
												return null;
											},
										},
									],
								},
							});
						},
					},
				});
			},
		},
	};
}

function throwPluginError(message: string, additionalHint?: string): never {
	let hint = 'See the error report above for more informations.\n\n';
	if (additionalHint) hint += `${additionalHint}\n\n`;
	hint +=
		'If you believe this is a bug, please file an issue at https://github.com/walter9388/starlight-dbt/issues/new';

	throw new AstroError(message, hint);
}
