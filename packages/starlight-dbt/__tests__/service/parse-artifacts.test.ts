import { describe, it, expect } from 'vitest';

import { parseDbtManifest, parseDbtCatalog } from '../../lib/service/parse-artifacts';

describe('parseDbtManifest', () => {
	it('parses a valid manifest v12', () => {
		const manifestV12 = {
			metadata: {
				dbt_schema_version: 'https://schemas.getdbt.com/dbt/manifest/v12.json',
			},
			nodes: {},
			sources: {},
			macros: {},
			exposures: {},
			metrics: {},
			groups: {},
			semantic_models: {},
			saved_queries: {},
			unit_tests: {},
			docs: {},
			selectors: {},
			disabled: null,
			parent_map: null,
			child_map: null,
			group_map: null,
		};

		expect(parseDbtManifest(manifestV12)).toBeDefined();
	});

	it('fails when parsing manifest v11', () => {
		const manifestV11 = {
			metadata: {
				dbt_schema_version: 'https://schemas.getdbt.com/dbt/manifest/v11.json',
			},
			nodes: {},
			sources: {},
			macros: {},
		};

		expect(() => parseDbtManifest(manifestV11)).toThrow();
	});
});

describe('parseDbtCatalog', () => {
	it('parses a valid catalog v1', () => {
		const catalogV1 = {
			metadata: {
				dbt_schema_version: 'https://schemas.getdbt.com/dbt/catalog/v1.json',
			},
			nodes: {},
			sources: {},
		};

		expect(parseDbtCatalog(catalogV1)).toBeDefined();
	});

	it('fails when parsing an unsupported catalog version', () => {
		const catalogV2 = {
			metadata: {
				dbt_schema_version: 'https://schemas.getdbt.com/dbt/catalog/v2.json',
			},
			nodes: {},
			sources: {},
		};

		expect(() => parseDbtCatalog(catalogV2)).toThrow();
	});
});
