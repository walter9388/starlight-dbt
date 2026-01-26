import { AstroError } from 'astro/errors';

import { StarlightDbtOptionsSchema, type StarlightDbtUserOptions } from './config';
import { getOrInitDbtService } from './lib/manager';
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
				const service = await getOrInitDbtService('default', {
					type: 'file',
					manifest: getDbtArtifactsAbsolutePath(config.manifest, astroConfig),
					catalog: getDbtArtifactsAbsolutePath(config.catalog, astroConfig),
				});

				try {
					updateConfig({
						sidebar: getDbtSidebar(
							starlightConfig.sidebar ?? [],
							service,
							config.baseUrl,
							config.project
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
								pattern: `[...slug]`,
								entrypoint: getPageTemplatePath(config),
							});

							// Virtual module to expose dbt project config to the loader
							const virtualModuleId = 'virtual:starlight-dbt/config';
							const resolvedVirtualModuleId = '\0' + virtualModuleId;
							updateConfig({
								vite: {
									plugins: [
										{
											name: 'starlight-dbt-virtual-config',
											resolveId(id) {
												if (id === virtualModuleId) return resolvedVirtualModuleId;

												return null;
											},
											load(id) {
												if (id === resolvedVirtualModuleId) {
													return `export const config = ${JSON.stringify(config)};`;
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
