import path from 'node:path';
import { readFileSync } from 'node:fs';

import { describe, it, expect } from 'vitest';

import { manifestV12Schema, parsedManifestV12Schema } from '../../lib/schemas/manifest';

const JAFFLE_MANIFEST = path.resolve(
	process.cwd(),
	'../../examples/jaffle-shop/src/content/dbt/jaffle_shop/manifest.json'
);

/** Minimal valid manifest v12 fixture. */
const minimalV12 = {
	metadata: {
		dbt_schema_version: 'https://schemas.getdbt.com/dbt/manifest/v12.json',
	},
	nodes: {},
	sources: {},
	macros: {},
	exposures: {},
	metrics: {},
	semantic_models: {},
	saved_queries: {},
	unit_tests: {},
};

describe('manifestV12Schema', () => {
	it('parses a minimal manifest', () => {
		const result = manifestV12Schema.parse(minimalV12);
		expect(result.metadata.dbt_schema_version).toContain('manifest/v12');
		expect(result.nodes).toEqual({});
		expect(result.sources).toEqual({});
	});

	it('passes through unknown top-level fields', () => {
		const withExtra = { ...minimalV12, some_future_field: 'value' };
		const result = manifestV12Schema.parse(withExtra);
		expect((result as Record<string, unknown>).some_future_field).toBe('value');
	});

	it('passes through unknown node fields', () => {
		const withNode = {
			...minimalV12,
			nodes: {
				'model.pkg.my_model': {
					unique_id: 'model.pkg.my_model',
					name: 'my_model',
					resource_type: 'model',
					package_name: 'pkg',
					original_file_path: 'models/my_model.sql',
					fqn: ['pkg', 'my_model'],
					future_field: 'hello',
				},
			},
		};
		const result = manifestV12Schema.parse(withNode);
		const node = result.nodes['model.pkg.my_model'];
		expect(node?.unique_id).toBe('model.pkg.my_model');
		expect((node as Record<string, unknown>).future_field).toBe('hello');
	});

	it('accepts a real jaffle-shop manifest', () => {
		const raw = JSON.parse(readFileSync(JAFFLE_MANIFEST, 'utf-8')) as Record<string, unknown>;
		const result = manifestV12Schema.parse(raw);
		expect(Object.keys(result.nodes).length).toBeGreaterThan(0);
		expect(result.metadata.project_name).toBeTruthy();
	});

	it('does not throw on missing optional fields', () => {
		// groups, docs, selectors are optional
		const withoutOptionals = {
			metadata: {
				dbt_schema_version: 'https://schemas.getdbt.com/dbt/manifest/v12.json',
			},
			nodes: {},
			sources: {},
			macros: {},
			exposures: {},
			metrics: {},
			semantic_models: {},
			saved_queries: {},
			unit_tests: {},
		};
		expect(() => manifestV12Schema.parse(withoutOptionals)).not.toThrow();
	});
});

describe('parsedManifestV12Schema', () => {
	it('accepts a manifest with v12 schema version', () => {
		const result = parsedManifestV12Schema.parse(minimalV12);
		expect(result).toBeDefined();
	});

	it('rejects a manifest with v11 schema version', () => {
		const v11 = {
			...minimalV12,
			metadata: {
				dbt_schema_version: 'https://schemas.getdbt.com/dbt/manifest/v11.json',
			},
		};
		expect(() => parsedManifestV12Schema.parse(v11)).toThrow('Only dbt manifest v12 is supported');
	});

	it('rejects a manifest with no schema version', () => {
		const noVersion = {
			...minimalV12,
			metadata: {},
		};
		expect(() => parsedManifestV12Schema.parse(noVersion)).toThrow('Only dbt manifest v12 is supported');
	});
});
