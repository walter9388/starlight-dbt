import path from 'node:path';

import { config as starlightDbtConfig } from 'virtual:starlight-dbt/config';

import { getOrInitDbtService } from './lib/manager';

import type { Loader } from 'astro/loaders';

export { dbtCollectionSchema } from './lib/schemas/collection';
export type { DbtCollectionEntry, DbtCollectionNode } from './lib/schemas/collection';

export function dbtLoader(): Loader {
	return {
		name: 'dbt-loader',
		load: async ({ store, logger, parseData, config: astroConfig }) => {
			if (starlightDbtConfig._projects.length === 0) {
				logger.warn('No dbt projects found to load.');
				return;
			}

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
					// Validate and transform the raw node
					const validatedData = await parseData({
						id: pageSlug,
						data: { ...node, _projectName: projectSlug },
					});

					// Commit it to the store
					store.set({ id: pageSlug, data: validatedData });
				}
			});

			logger.info(`Loaded dbt projects: ${starlightDbtConfig._projects.join(', ')}`);
		},
	};
}
