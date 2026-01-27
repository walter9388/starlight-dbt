import { describe, it, expect } from 'vitest';

import { parseDbtManifest, parseDbtCatalog } from '../../lib/service/parse-artifacts';

describe('parseDbtManifest', () => {
	it('parses a valid manifest v12', async () => {
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
		};

		await expect(parseDbtManifest(manifestV12)).resolves.toBeDefined();
	});

	it('fails when parsing manifest v11', async () => {
		const manifestV11 = {
			metadata: {
				dbt_schema_version: 'https://schemas.getdbt.com/dbt/manifest/v11.json',
			},
			nodes: {},
			sources: {},
			macros: {},
		};

		await expect(parseDbtManifest(manifestV11)).rejects.toThrow();
	});
});

describe('parseDbtCatalog', () => {
	it('parses a valid catalog v1', async () => {
		const catalogV1 = {
			metadata: {
				dbt_schema_version: 'https://schemas.getdbt.com/dbt/catalog/v1.json',
			},
			nodes: {},
			sources: {},
		};

		await expect(parseDbtCatalog(catalogV1)).resolves.toBeDefined();
	});

	it('fails when parsing an unsupported catalog version', async () => {
		const catalogV2 = {
			metadata: {
				dbt_schema_version: 'https://schemas.getdbt.com/dbt/catalog/v2.json',
			},
			nodes: {},
			sources: {},
		};

		await expect(parseDbtCatalog(catalogV2)).rejects.toThrow();
	});
});
