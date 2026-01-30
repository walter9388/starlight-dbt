import path from 'node:path';

import { config } from 'virtual:starlight-dbt/config';

import { getOrInitDbtService } from './lib/manager';

import type { Loader } from 'astro/loaders';

export function dbtLoader(): Loader {
	return {
		name: 'dbt-loader',
		load: async ({ store, logger, parseData }) => {
			logger.info(`Scanning for dbt projects in ${config.baseDir}`);
			config._projects.map(async (projectSlug) => {
				const projectPath = path.join(config.baseDir, projectSlug);
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
					const pageSlug = `${config.baseUrl}/${projectSlug}/${uniqueId}`;
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

			logger.info(`Loaded dbt projects: ${config._projects.join(', ')}`);
		},
	};
}
