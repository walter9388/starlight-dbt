import type { ManifestArtifact, CatalogArtifact } from '../../utils/load/types';

export const testManifest: ManifestArtifact = {
	metadata: {
		dbt_schema_version: 'https://schemas.getdbt.com/dbt/manifest/v12.json',
	},
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

export const testCatalog: CatalogArtifact = {
	metadata: {
		dbt_schema_version: 'https://schemas.getdbt.com/dbt/catalog/v1.json',
	},
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
