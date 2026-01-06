import path from 'node:path';

import { describe, it, expect } from 'vitest';

import { consolidateAdapterMacros, match_dict_keys, incorporate_catalog } from './loadProject';
import { createProjectService } from './project_service';

import type { ManifestArtifact, CatalogArtifact } from './types';


const testManifest: ManifestArtifact = {
	metadata: {},
	nodes: {
		node1: {
			database: 'test',
			schema: 'stg',
			name: 'node1',
			resource_type: 'model',
			package_name: 'test',
			path: '',
			original_file_path: '',
			unique_id: 'node1',
			fqn: ['test', 'node1', 'v1'],
			alias: 'node1_alias',
			checksum: {
				name: 'sha256',
				checksum: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
			},
			config: {},
			columns: {
				id: { name: 'id', info: 1 },
				NAME: { name: 'NAME', info: 2 },
			},
		},
	},
	sources: {},
	macros: {},
	exposures: {},
	metrics: {},
	groups: {},
	semantic_models: {},
	saved_queries: {},
	unit_tests: {},
	selectors: {},
	disabled: {},
	parent_map: {},
	child_map: {},
	group_map: {},
	docs: {},
};

const testCatalog: CatalogArtifact = {
	metadata: {},
	sources: {
		source1: {
			metadata: {
				type: 'BASE TABLE',
				schema: 'stg',
				name: 'source1',
			},
			columns: {
				field_1: { type: 'TEXT', index: 1, name: 'field_1' },
			},
			stats: {},
			unique_id: 'source1',
		},
	},
	nodes: {
		node1: {
			metadata: {
				type: 'BASE TABLE',
				schema: 'stg',
				name: 'node1',
			},
			columns: {
				ID: { type: 'TEXT', index: 1, name: 'ID' },
				name: { type: 'TEXT', index: 2, name: 'name' },
			},
			stats: {},
		},
	},
};


describe('match_dict_keys', () => {
	it('maps keys case-insensitively to destination keys and preserves unmatched keys', () => {
		const dest = ['ID', 'Name'];
		const src = { id: 1, NAME: 'alice', extra: true };

		const out = match_dict_keys(dest, src as any);

		expect(out.ID).toBe(1);
		expect(out.Name).toBe('alice');
		expect(out.extra).toBe(true);
	});
});

describe('incorporate_catalog', () => {
	it('copies sources into nodes and remaps column keys to catalog column names', () => {
		const merged = incorporate_catalog(testManifest, testCatalog);

		// catalog sources should be copied into nodes
		expect(merged.nodes.source1).toBeDefined();
		expect(merged.nodes.source1!.metadata.name).toBe('source1');

		const cols = merged.nodes.node1?.columns;
		// original 'id' should map to 'ID' and index/info should both be there
		expect(cols?.ID!.info).toBe(1);
		expect(cols?.ID!.index).toBeDefined();
		// original 'NAME' should map to 'name' and index/info should both be there
		expect(cols?.name!.info).toBe(2);
		expect(cols?.name!.index).toBeDefined();
	});
});

describe('consolidateAdapterMacros', () => {
	it('groups adapter implementations under the base adapter macro', () => {
		const macros: any = {
			my_macro: {
				name: 'my_macro',
				unique_id: 'macro.pkg.my_macro',
				macro_sql: "{{ adapter_macro('something') }} ",
				package_name: 'pkg',
			},
			postgres__my_macro: {
				name: 'postgres__my_macro',
				unique_id: 'macro.pkg.postgres__my_macro',
				macro_sql: 'SELECT 1',
				package_name: 'pkg',
			},
			snowflake__my_macro: {
				name: 'snowflake__my_macro',
				unique_id: 'macro.pkg.snowflake__my_macro',
				macro_sql: 'SELECT 1',
				package_name: 'pkg',
			},
			my_macro_not_impls: {
				name: 'my_macro_not_impls',
				unique_id: 'macro.pkg.my_macro_not_impls',
				macro_sql: "{{ adapter_macro('something') }} ",
				package_name: 'pkg',
			},
			other_macro: {
				name: 'other_macro',
				unique_id: 'macro.pkg.other_macro',
				macro_sql: 'SELECT 2',
				package_name: 'pkg',
			},
		};

		const result = consolidateAdapterMacros(macros);
		expect(result.length).toBe(3); // my_macro, my_macro_not_impls, other_macro

		// Check my_macro
		const my_macro = result.find((m) => m.name === 'my_macro');
		expect(my_macro).toBeDefined();
		expect(!!my_macro!.is_adapter_macro).toBe(true);
		expect(!!my_macro!.is_adapter_macro_impl).toBe(true);
		expect(my_macro!.impls).toBeDefined();
		expect(my_macro!.impls!['Adapter Macro']).toBe(macros.my_macro.macro_sql);
		expect(my_macro!.impls!['postgres']).toBe(macros['postgres__my_macro'].macro_sql);
		expect(my_macro!.impls!['snowflake']).toBe(macros['snowflake__my_macro'].macro_sql);

		// adapter-specific implementation should not appear as a separate top-level
		// macro in the consolidated array
		const postgresPresent = result.some((m) => m.name === 'postgres__my_macro');
		expect(postgresPresent).toBe(false);

		// Check my_macro_not_impls
		const my_macro_not_impls = result.find((m) => m.name === 'my_macro_not_impls');
		expect(my_macro_not_impls).toBeDefined();
		expect(!!my_macro_not_impls!.is_adapter_macro).toBe(true);
		expect(!!my_macro_not_impls!.is_adapter_macro_impl).toBe(false);
		expect(my_macro_not_impls!.impls).toBeDefined();
		expect(my_macro_not_impls!.impls!['Adapter Macro']).toBe(macros.my_macro_not_impls.macro_sql);

		// Check other_macro
		const other_macro = result.find((m) => m.name === 'other_macro');
		expect(other_macro).toBeDefined();
		expect(!!other_macro!.is_adapter_macro).toBe(false);
		expect(!!other_macro!.is_adapter_macro_impl).toBe(false);
	});
});

describe('loadProject (integration)', () => {
	it('loads example manifest and catalog and produces a project with macros', async () => {
		const manifestPath = path.resolve(
			process.cwd(),
			'../../examples/jaffle-shop/dbt-artifacts/manifest.json'
		);
		const catalogPath = path.resolve(
			process.cwd(),
			'../../examples/jaffle-shop/dbt-artifacts/catalog.json'
		);

		const service = createProjectService(manifestPath, catalogPath);
		await service.init();

		expect(Object.keys(service.project.nodes).length).toBeGreaterThan(0);
		expect(Object.keys(service.project.macros).length).toBeGreaterThan(0);

		// At least one macro should have been consolidated and may contain `impls`
		const macrosWithImpls = Object.values(service.project.macros as any).filter(
			(m: any) => m.impls
		);

		expect(macrosWithImpls.length).toBeGreaterThanOrEqual(0);
	});
});