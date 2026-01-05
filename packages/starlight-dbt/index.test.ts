import path from 'node:path';
import { describe, it, expect } from 'vitest';
import { createProjectService } from './utils/project_service';

describe('Project service', () => {
	it('loads manifest and catalog and initializes project', async () => {
		const manifestPath = path.resolve(
			process.cwd(),
			'../../examples/jaffle-shop/dbt-artifacts/manifest.json'
		);
		const catalogPath = path.resolve(
			process.cwd(),
			'../../examples/jaffle-shop/dbt-artifacts/catalog.json'
		);

		console.log('Loading dbt artifacts:');
		console.log('  manifest:', manifestPath);
		console.log('  catalog :', catalogPath);

		const service = createProjectService(manifestPath, catalogPath);
		await service.init();

		console.log('✔ Project loaded successfully');
		console.log('Nodes:', Object.keys(service.project.nodes).length);
		console.log('Macros:', Object.keys(service.project.macros).length);

		// simple checks
		expect(Object.keys(service.project.nodes).length).toBeGreaterThan(0);
		expect(Object.keys(service.project.macros).length).toBeGreaterThan(0);
	});
});
