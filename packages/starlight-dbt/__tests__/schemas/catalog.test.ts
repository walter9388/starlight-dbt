import path from 'node:path';
import { readFileSync } from 'node:fs';

import { describe, it, expect } from 'vitest';

import { catalogV1Schema, parsedCatalogV1Schema } from '../../lib/schemas/catalog';

const JAFFLE_CATALOG = path.resolve(
	process.cwd(),
	'../../examples/jaffle-shop/src/content/dbt/jaffle_shop/catalog.json'
);

/** Minimal valid catalog v1 fixture. */
const minimalV1 = {
	metadata: {
		dbt_schema_version: 'https://schemas.getdbt.com/dbt/catalog/v1.json',
	},
	nodes: {},
	sources: {},
};

/** A single catalog table fixture with all fields populated. */
const sampleTable = {
	metadata: {
		type: 'table',
		schema: 'public',
		name: 'customers',
		database: 'analytics',
		comment: null,
		owner: 'analytics_user',
	},
	columns: {
		customer_id: {
			type: 'bigint',
			index: 1,
			name: 'customer_id',
			comment: null,
		},
		name: {
			type: 'varchar',
			index: 2,
			name: 'name',
			comment: 'Full customer name',
		},
	},
	stats: {
		num_rows: {
			id: 'num_rows',
			label: 'Number of rows',
			value: 1000,
			include: true,
			description: 'Row count',
		},
		has_stats: {
			id: 'has_stats',
			label: 'Has statistics',
			value: true,
			include: false,
		},
	},
	unique_id: 'model.jaffle_shop.customers',
};

describe('catalogV1Schema', () => {
	it('parses a minimal catalog', () => {
		const result = catalogV1Schema.parse(minimalV1);
		expect(result.nodes).toEqual({});
		expect(result.sources).toEqual({});
	});

	it('parses a catalog with a full table entry', () => {
		const withNode = {
			...minimalV1,
			nodes: { 'model.jaffle_shop.customers': sampleTable },
		};
		const result = catalogV1Schema.parse(withNode);
		const node = result.nodes['model.jaffle_shop.customers'];
		expect(node?.metadata.name).toBe('customers');
		expect(node?.metadata.type).toBe('table');
		expect(node?.columns['customer_id']?.type).toBe('bigint');
		expect(node?.columns['customer_id']?.index).toBe(1);
		expect(node?.stats['num_rows']?.value).toBe(1000);
		expect(node?.unique_id).toBe('model.jaffle_shop.customers');
	});

	it('parses stats with various value types', () => {
		const withStats = {
			...minimalV1,
			nodes: {
				'model.pkg.test': {
					...sampleTable,
					stats: {
						bool_stat: { id: 'bool_stat', label: 'Bool', value: false, include: true },
						str_stat: { id: 'str_stat', label: 'Str', value: 'hello', include: true },
						null_stat: { id: 'null_stat', label: 'Null', value: null, include: false },
						num_stat: { id: 'num_stat', label: 'Num', value: 42, include: true },
					},
				},
			},
		};
		const result = catalogV1Schema.parse(withStats);
		const stats = result.nodes['model.pkg.test']?.stats;
		expect(stats?.['bool_stat']?.value).toBe(false);
		expect(stats?.['str_stat']?.value).toBe('hello');
		expect(stats?.['null_stat']?.value).toBe(null);
		expect(stats?.['num_stat']?.value).toBe(42);
	});

	it('accepts a real jaffle-shop catalog', () => {
		const raw = JSON.parse(readFileSync(JAFFLE_CATALOG, 'utf-8')) as Record<string, unknown>;
		const result = catalogV1Schema.parse(raw);
		expect(Object.keys(result.nodes).length).toBeGreaterThan(0);
	});

	it('passes through unknown top-level fields', () => {
		const withExtra = { ...minimalV1, _compile_results: { some: 'data' } };
		const result = catalogV1Schema.parse(withExtra);
		expect((result as Record<string, unknown>)._compile_results).toEqual({ some: 'data' });
	});
});

describe('parsedCatalogV1Schema', () => {
	it('accepts a catalog with v1 schema version', () => {
		const result = parsedCatalogV1Schema.parse(minimalV1);
		expect(result).toBeDefined();
	});

	it('rejects a catalog with v2 schema version', () => {
		const v2 = {
			...minimalV1,
			metadata: {
				dbt_schema_version: 'https://schemas.getdbt.com/dbt/catalog/v2.json',
			},
		};
		expect(() => parsedCatalogV1Schema.parse(v2)).toThrow('Only dbt catalog v1 is supported');
	});

	it('rejects a catalog with no schema version', () => {
		const noVersion = { ...minimalV1, metadata: {} };
		expect(() => parsedCatalogV1Schema.parse(noVersion)).toThrow(
			'Only dbt catalog v1 is supported'
		);
	});
});
