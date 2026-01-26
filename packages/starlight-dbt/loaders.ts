import fs from 'node:fs/promises';
import path from 'node:path';

import { config } from 'virtual:starlight-dbt/config';

import { getOrInitDbtService } from './lib/manager';

import type { Loader } from 'astro/loaders';

export function dbtLoader(): Loader {
	return {
		name: 'dbt-loader',
		load: async ({ store, logger, parseData }) => {
			logger.info(`Scanning for dbt projects in ${config.baseDir}`);

			// Find all project directories
			let projectDirs: string[] = [];
			try {
				const entries = await fs.readdir(config.baseDir, { withFileTypes: true });
				projectDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
			} catch (e) {
				logger.warn(`Could not find dbt directory at ${config.baseDir}`);
				return;
			}

			for (const projectName of projectDirs) {
				const projectPath = path.join(config.baseDir, projectName);
				const manifestPath = path.join(projectPath, 'manifest.json');
				const catalogPath = path.join(projectPath, 'catalog.json');
				logger.info(`Loading dbt project '${projectName}'`);

				const service = await getOrInitDbtService(projectName, {
					type: 'file',
					manifest: manifestPath,
					catalog: catalogPath,
				});

				// Map existing node_map to the Astro Store
				for (const [uniqueId, node] of Object.entries(service.node_map)) {
					const slug = `${config.baseUrl}/${projectName}/${uniqueId}`;
					const data = await parseData({
						id: slug,
						data: {
							...node,
							_projectName: projectName,
						},
					});
					store.set({ id: slug, data });
				}
			}

			logger.info(`Loaded dbt projects: ${projectDirs.join(', ')}`);
		},
	};
}
