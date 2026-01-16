import path from 'node:path';

import { describe, it, expect } from 'vitest';

import { match_dict_keys, incorporate_catalog } from '../../lib/load/incorporateCatalog';
import { loadManifestV12, loadCatalogV1 } from '../../lib/load/loadArtifacts';

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
	it('copies sources into nodes and remaps column keys to catalog column names', async () => {
		const testManifestPath = path.resolve(
			process.cwd(),
			'__e2e__/fixtures/basics/dbt-artifacts/manifest.json'
		);
		const testCatalogPath = path.resolve(
			process.cwd(),
			'__e2e__/fixtures/basics/dbt-artifacts/catalog.json'
		);
		const testManifest = await loadManifestV12(testManifestPath);
		const testCatalog = await loadCatalogV1(testCatalogPath);

		const merged = incorporate_catalog(testManifest, testCatalog);

		// catalog sources should be copied into nodes
		expect(merged.nodes.source1).toBeDefined();
		expect(merged.nodes.source1!.metadata.name).toBe('source1');

		const cols = merged.nodes.model_node?.columns;
		// original 'id' should map to 'ID' and index/info should both be there
		expect(cols?.ID!.info).toBe(1);
		expect(cols?.ID!.index).toBeDefined();
		// original 'NAME' should map to 'name' and index/info should both be there
		expect(cols?.name!.info).toBe(2);
		expect(cols?.name!.index).toBeDefined();
	});
});
