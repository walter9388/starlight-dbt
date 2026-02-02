import path from 'node:path';

import { config as starlightDbtConfig } from 'virtual:starlight-dbt/config';

import { getOrInitDbtService } from './lib/manager';

import type { Loader } from 'astro/loaders';

export function dbtLoader(): Loader {
	return {
		name: 'dbt-loader',
		load: async ({ store, logger, parseData, config: astroConfig }) => {
			logger.info(`Scanning for dbt projects in ${starlightDbtConfig.baseDir}`);
			starlightDbtConfig._projects.map(async (projectSlug) => {
				const projectPath = path.join(
					astroConfig.root.pathname,
					starlightDbtConfig.baseDir,
					projectSlug
				);
				const manifestPath = path.join(projectPath, 'manifest.json');
				const catalogPath = path.join(projectPath, 'catalog.json');
				logger.info(`Loading dbt project: ${projectSlug}`);

				const service = await getOrInitDbtService(projectSlug, {
					type: 'file',
					manifest: manifestPath,
					catalog: catalogPath,
				});

				// Map existing node_map to the Astro Store
				for (const [uniqueId, node] of Object.entries(service.node_map)) {
					const pageSlug = `${starlightDbtConfig.baseUrl}/${projectSlug}/${uniqueId}`;
					const data = await parseData({
						id: pageSlug,
						data: {
							...node,
							_projectName: projectSlug,
						},
					});
					store.set({ id: projectSlug, data });
				}
			});

			logger.info(`Loaded dbt projects: ${starlightDbtConfig._projects.join(', ')}`);
		},
	};
}
