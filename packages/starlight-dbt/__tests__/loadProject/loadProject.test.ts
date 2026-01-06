import path from 'node:path';

import { describe, it, expect } from 'vitest';

import { testManifest, testCatalog } from './dummyData';
import { createProjectService } from '../../utils/projectService';

type TestCase = {
	name: string;
	createService: () => ReturnType<typeof createProjectService>;
};

describe('loadProject (integration)', () => {
	const cases: TestCase[] = [
		{
			name: 'in-memory dummy artifacts',
			createService: () => {
				return createProjectService(testManifest as any, testCatalog as any);
			},
		},
		{
			name: 'real dbt artifacts (jaffle shop)',
			createService: () => {
				const manifestPath = path.resolve(
					process.cwd(),
					'../../examples/jaffle-shop/dbt-artifacts/manifest.json'
				);
				const catalogPath = path.resolve(
					process.cwd(),
					'../../examples/jaffle-shop/dbt-artifacts/catalog.json'
				);

				return createProjectService(manifestPath, catalogPath);
			},
		},
	];

	describe.each(cases)('$name', ({ createService }) => {
		it('loads manifest and catalog and produces a project with nodes', async () => {
			const service = createService();
			await service.init();

			expect(Object.keys(service.project.nodes).length).toBeGreaterThan(0);
		});
	});
});
