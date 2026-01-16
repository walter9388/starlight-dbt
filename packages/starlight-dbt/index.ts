import type { StarlightPlugin } from '@astrojs/starlight/types';

import { AstroError } from 'astro/errors';

import { StarlightDbtOptionsSchema, type StarlightDbtUserOptions } from './config';
import { createProjectService } from './lib/projectService';
import { getPageTemplatePath } from './utils';

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
			async 'config:setup'({ addIntegration, logger }) {
				logger.info(`Using manifest: ${config.manifest}`);
				logger.info(`Using catalog: ${config.catalog}`);

				addIntegration({
					name: 'starlight-dbt-integration',
					hooks: {
						'astro:config:setup': async ({ injectRoute, updateConfig }) => {
							const virtualModuleId = 'virtual:dbt-data';
							const resolvedVirtualModuleId = '\0' + virtualModuleId;

							// load manifest and catalog files from local filesystem
							const service = createProjectService(config.manifest, config.catalog);
							await service.init();

							injectRoute({
								pattern: `${config.basePath}/[...slug]`,
								entrypoint: getPageTemplatePath(config),
							});

							updateConfig({
								vite: {
									plugins: [
										{
											name: 'vite-plugin-dbt-data',
											resolveId(id) {
												if (id === virtualModuleId) return resolvedVirtualModuleId;
											},
											load(id) {
												if (id === resolvedVirtualModuleId) {
													// Export the data as a stringified JS object
													return `export const dbtData = ${JSON.stringify(service.project)};`;
												}
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
