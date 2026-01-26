import fs from 'node:fs/promises';
import path from 'node:path';

import { getOrInitDbtService } from './lib/manager';

import type { Loader } from 'astro/loaders';

export function dbtLoader(options: { baseDir?: string; baseUrl?: string } = {}): Loader {
	return {
		name: 'dbt-loader',
		load: async ({ store, logger, parseData }) => {
			const baseDir = options.baseDir || 'src/content/dbt';
			const baseUrl = options.baseUrl || 'dbt';
			logger.info(`Scanning for dbt projects in ${baseDir}`);

			// Find all project directories
			let projectDirs: string[] = [];
			try {
				const entries = await fs.readdir(baseDir, { withFileTypes: true });
				projectDirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
			} catch (e) {
				logger.warn(`Could not find dbt directory at ${baseDir}`);
				return;
			}

			for (const projectName of projectDirs) {
				const projectPath = path.join(baseDir, projectName);
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
					const slug = `${baseUrl}/${projectName}/${uniqueId}`;
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
