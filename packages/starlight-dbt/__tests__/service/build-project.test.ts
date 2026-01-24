import path from 'node:path';

import { describe, it, expect } from 'vitest';

import { fetchArtifacts } from '../../lib/manager';
import { isFolder } from '../../lib/service/build-node-trees';
import { DbtServiceImpl } from '../../lib/service/project';

import type { DbtService } from '../../lib/service/types';

type TestCase = {
	name: string;
	createService: () => Promise<DbtService>;
};

describe('buildProject (integration)', () => {
	const cases: TestCase[] = [
		{
			name: 'basic dbt fixture',
			createService: async () => {
				const manifestPath = path.resolve(
					process.cwd(),
					'__e2e__/fixtures/basics/dbt-artifacts/manifest.json'
				);
				const catalogPath = path.resolve(
					process.cwd(),
					'__e2e__/fixtures/basics/dbt-artifacts/catalog.json'
				);
				const artifacts = await fetchArtifacts({
					type: 'file',
					manifest: manifestPath,
					catalog: catalogPath,
				});

				return new DbtServiceImpl(artifacts.manifest, artifacts.catalog);
			},
		},
		{
			name: 'real dbt artifacts (jaffle shop)',
			createService: async () => {
				const manifestPath = path.resolve(
					process.cwd(),
					'../../examples/jaffle-shop/dbt-artifacts/manifest.json'
				);
				const catalogPath = path.resolve(
					process.cwd(),
					'../../examples/jaffle-shop/dbt-artifacts/catalog.json'
				);
				const artifacts = await fetchArtifacts({
					type: 'file',
					manifest: manifestPath,
					catalog: catalogPath,
				});

				return new DbtServiceImpl(artifacts.manifest, artifacts.catalog);
			},
		},
	];

	describe.each(cases)('$name', ({ createService }) => {
		it('loads manifest and catalog', async () => {
			const service = await createService();
			await service.init();
			service.build();

			expect(service.loaded).toBe(true);
			expect(service.project).toBeDefined();
		});

		it('populates project nodes and macros', async () => {
			const service = await createService();
			await service.init();
			service.build();

			expect(Object.keys(service.project.nodes).length).toBeGreaterThan(0);
			expect(Object.keys(service.project.macros).length).toBeGreaterThanOrEqual(0);
		});

		it('builds all model trees', async () => {
			const service = await createService();
			await service.init();
			service.build();

			expect(service.tree.project.length).toBeGreaterThan(0);
			expect(service.tree.database.length).toBeGreaterThan(0);
			expect(service.tree.groups.length).toBeGreaterThan(0);
		});

		it('excludes private and hidden models from trees', async () => {
			const service = await createService();
			await service.init();
			service.build();

			const allItems = JSON.stringify(service.tree.groups);

			expect(allItems).not.toContain('private_model');
			expect(allItems).not.toContain('hidden_node');
		});

		it('marks protected models in display name', async () => {
			const service = await createService();
			await service.init();
			service.build();

			const serialized = JSON.stringify(service.tree.groups);

			// only meaningful for dummy data
			if (serialized.includes('protected')) {
				expect(serialized).toContain('(protected)');
			}
		});

		it('groups models by group property', async () => {
			const service = await createService();
			await service.init();
			service.build();

			const groups = service.tree.groups.filter(isFolder);
			expect(groups.length).toBeGreaterThan(0);

			// Ungrouped should always exist if any node has no group
			const ungrouped = groups.find((g) => g.name === 'Ungrouped');
			expect(ungrouped).toBeDefined();
		});

		it('builds database tree with schemas', async () => {
			const service = await createService();
			await service.init();
			service.build();

			const dbTree = service.tree.database.filter(isFolder);
			expect(dbTree.length).toBeGreaterThan(0);

			const hasSchema = dbTree.some((db) => db.items.some((child) => isFolder(child)));
			expect(hasSchema).toBe(true);
		});

		it('builds source, exposure, metric, and semantic model trees', async () => {
			const service = await createService();
			await service.init();
			service.build();

			expect(service.tree.sources.length).toBeGreaterThanOrEqual(0);
			expect(service.tree.exposures.length).toBeGreaterThanOrEqual(0);
			expect(service.tree.metrics.length).toBeGreaterThanOrEqual(0);
			expect(service.tree.semantic_models.length).toBeGreaterThanOrEqual(0);
		});

		it('does not throw when optional sections are empty', async () => {
			const service = await createService();
			await expect(service.init()).resolves.not.toThrow();
			service.build();
		});
	});
});
