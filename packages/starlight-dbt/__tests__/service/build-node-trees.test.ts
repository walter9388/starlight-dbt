import { describe, it, expect } from 'vitest';

import {
	buildExposureTree,
	buildMetricTree,
	buildSemanticModelTree,
	buildSavedQueryTree,
	buildSourceTree,
	buildProjectTree,
	buildDatabaseTree,
	buildGroupTree,
	buildUnitTestTree,
	populateNodeMap,
	isFolder,
	assertFolder,
} from '../../lib/service/build-node-trees';

import type { TreeFolder, TreeFile } from '../../lib/service/types';

describe('buildSourceTree', () => {
	it('groups sources by source_name, sorts and marks active selection', () => {
		const nodes = [
			{ name: 'src_c', source_name: 's1', unique_id: 'src.s1.src_c' },
			{ name: 'src_a', source_name: 's1', unique_id: 'src.s1.src_a' },
			{ name: 'src_b', source_name: 's2', unique_id: 'src.s2.src_b' },
		] as any;

		const tree = buildSourceTree(nodes, 'src.s1.src_c');

		// Should create folders for s1 and s2
		expect(tree.map((t) => t.name)).toEqual(expect.arrayContaining(['s1', 's2']));

		const s1 = tree.find((t) => t.name === 's1')!;
		expect(isFolder(s1)).toBe(true);
		expect(s1.active).toBe(true); // src_c is selected
		expect(s1.items).toHaveLength(2);
		expect(s1.items.find((t) => t.name === 'src_c')!.active).toBe(true);

		const itemNames = s1.items.map((i) => i.name);
		expect(itemNames).toEqual(['src_a', 'src_c']); // sorted by name

		const s2 = tree.find((t) => t.name === 's2')!;
		expect(s2.active).toBe(false);
		expect(s2.items[0]!.active).toBe(false);
	});
});

describe('buildExposureTree', () => {
	it('groups exposures by type, sorts and marks active selection', () => {
		const nodes = [
			{ name: 'exp_c', label: 'C', type: 'dashboard', unique_id: 'exp.pkg.exp_c' },
			{ name: 'exp_a', label: 'A', type: 'dashboard', unique_id: 'exp.pkg.exp_a' },
			{ name: 'exp_b', label: 'B', type: 'report', unique_id: 'exp.pkg.exp_b' },
			{ name: 'exp_d', unique_id: 'exp.pkg.exp_d' },
		] as any;

		const tree = buildExposureTree(nodes, 'exp.pkg.exp_c');

		// Should create folders for Dashboard, Report, Uncategorized
		expect(tree.map((t) => t.name)).toEqual(
			expect.arrayContaining(['Dashboard', 'Report', 'Uncategorized'])
		);

		const dashboard = tree.find((t) => t.name === 'Dashboard')!;
		expect(isFolder(dashboard)).toBe(true);
		expect(dashboard.active).toBe(true);
		expect(dashboard.items).toHaveLength(2);

		const firstItemNames = dashboard.items.map((i) => i.name);
		expect(firstItemNames).toEqual(['A', 'C']);

		const uncategorized = tree.find((t) => t.name === 'Uncategorized')!;
		expect(uncategorized.items).toHaveLength(1);
		expect(uncategorized.items[0]!.name).toBe('exp_d');
	});
});

describe('buildMetricTree', () => {
	it('groups metrics by package_name, sorts and marks active selection', () => {
		const nodes = [
			{ name: 'metric_c', package_name: 'pkg1', unique_id: 'metric.pkg1.metric_c' },
			{
				name: 'metric_a',
				label: 'Metric A',
				package_name: 'pkg1',
				unique_id: 'metric.pkg1.metric_a',
			},
			{
				name: 'metric_b',
				label: 'Metric B',
				package_name: 'pkg2',
				unique_id: 'metric.pkg2.metric_b',
			},
		] as any;

		const tree = buildMetricTree(nodes, 'metric.pkg1.metric_c');

		// Should create folders for pkg1 and pkg2
		expect(tree.map((t) => t.name)).toEqual(expect.arrayContaining(['pkg1', 'pkg2']));

		const pkg1 = tree.find((t) => t.name === 'pkg1')!;
		expect(isFolder(pkg1)).toBe(true);
		expect(pkg1.active).toBe(true);
		expect(pkg1.items.find((t) => t.name === 'metric_c')!.active).toBe(true);

		const itemNames = (pkg1.items as any[]).map((i) => i.name);
		expect(itemNames).toEqual(['Metric A', 'metric_c']); // sorted, metric_a uses label

		const pkg2 = tree.find((t) => t.name === 'pkg2')!;
		expect(pkg2.active).toBe(false);
		expect(pkg2.items[0]!.active).toBe(false);
	});
});

describe('buildSemanticModelTree', () => {
	it('groups semantic models by package_name, sorts and marks active selection', () => {
		const nodes = [
			{ name: 'model_c', package_name: 'pkg1', unique_id: 'sm.pkg1.model_c' },
			{ name: 'model_a', package_name: 'pkg1', unique_id: 'sm.pkg1.model_a' },
			{ name: 'model_b', package_name: 'pkg2', unique_id: 'sm.pkg2.model_b' },
		] as any;

		const tree = buildSemanticModelTree(nodes, 'sm.pkg1.model_c');

		// Should create folders for pkg1 and pkg2
		expect(tree.map((t) => t.name)).toEqual(expect.arrayContaining(['pkg1', 'pkg2']));

		const pkg1 = tree.find((t) => t.name === 'pkg1')!;
		expect(isFolder(pkg1)).toBe(true);
		expect(pkg1.items.find((t) => t.name === 'model_c')!.active).toBe(true);

		const itemNames = (pkg1.items as any[]).map((i) => i.name);
		expect(itemNames).toEqual(['model_a', 'model_c']); // sorted by name

		const pkg2 = tree.find((t) => t.name === 'pkg2')!;
		expect(pkg2.active).toBe(false);
		expect(pkg2.items[0]!.active).toBe(false);
	});
});

describe('buildSavedQueryTree', () => {
	it('groups saved queries by package_name, sorts and marks active selection', () => {
		const nodes = [
			{ name: 'query_c', package_name: 'pkg1', unique_id: 'sq.pkg1.query_c' },
			{ name: 'query_a', package_name: 'pkg1', unique_id: 'sq.pkg1.query_a' },
			{ name: 'query_b', package_name: 'pkg2', unique_id: 'sq.pkg2.query_b' },
		] as any;

		const tree = buildSavedQueryTree(nodes, 'sq.pkg1.query_c');

		// Should create folders for pkg1 and pkg2
		expect(tree.map((t) => t.name)).toEqual(expect.arrayContaining(['pkg1', 'pkg2']));

		const pkg1 = tree.find((t) => t.name === 'pkg1')!;
		expect(isFolder(pkg1)).toBe(true);
		expect(pkg1.items.find((t) => t.name === 'query_c')!.active).toBe(true);

		const itemNames = (pkg1.items as any[]).map((i) => i.name);
		expect(itemNames).toEqual(['query_a', 'query_c']); // sorted by name

		const pkg2 = tree.find((t) => t.name === 'pkg2')!;
		expect(pkg2.active).toBe(false);
		expect(pkg2.items[0]!.active).toBe(false);
	});
});

describe('buildUnitTestTree', () => {
	it('groups unit tests by package_name, sorts and marks active selection', () => {
		const nodes = [
			{ name: 'test_c', package_name: 'pkg1', unique_id: 'test.pkg1.test_c' },
			{ name: 'test_a', package_name: 'pkg1', unique_id: 'test.pkg1.test_a' },
			{ name: 'test_b', package_name: 'pkg2', unique_id: 'test.pkg2.test_b' },
		] as any;

		const tree = buildUnitTestTree(nodes, 'test.pkg1.test_c');

		// Should create folders for pkg1 and pkg2
		expect(tree.map((t) => t.name)).toEqual(expect.arrayContaining(['pkg1', 'pkg2']));

		const pkg1 = tree.find((t) => t.name === 'pkg1')!;
		expect(isFolder(pkg1)).toBe(true);
		expect(pkg1.active).toBe(true);
		expect(pkg1.items.find((t) => t.name === 'test_c')!.active).toBe(true);

		const itemNames = (pkg1.items as any[]).map((i) => i.name);
		expect(itemNames).toEqual(['test_a', 'test_c']); // sorted by name

		const pkg2 = tree.find((t) => t.name === 'pkg2')!;
		expect(pkg2.active).toBe(false);
		expect(pkg2.items[0]!.active).toBe(false);
	});

	it('handles empty input gracefully', () => {
		const tree = buildUnitTestTree([], undefined);
		expect(tree).toEqual([]);
	});
});

describe('buildProjectTree', () => {
	it('builds a hierarchical project tree from models and macros', () => {
		const nodes = [
			// versioned model (active)
			{
				name: 'orders',
				resource_type: 'model',
				package_name: 'pkg',
				original_file_path: 'models/core/orders.sql',
				unique_id: 'model.pkg.orders',
				version: 2,
			},

			// non-versioned analysis
			{
				name: 'revenue_analysis',
				resource_type: 'analysis',
				package_name: 'pkg',
				original_file_path: 'analysis/revenue.sql',
				unique_id: 'analysis.pkg.revenue',
			},

			// hidden doc → excluded
			{
				name: 'hidden_model',
				resource_type: 'model',
				package_name: 'pkg',
				original_file_path: 'models/hidden.sql',
				unique_id: 'model.pkg.hidden',
				docs: { show: false },
			},

			// unsupported resource_type → excluded
			{
				name: 'metric1',
				resource_type: 'metric',
				package_name: 'pkg',
				original_file_path: 'metrics/m1.yml',
				unique_id: 'metric.pkg.m1',
			},
		] as any[];

		const macros = [
			{
				name: 'do_something',
				resource_type: 'macro',
				package_name: 'pkg',
				original_file_path: 'macros/utils/do_something.sql',
				unique_id: 'macro.pkg.do_something',
			},
		] as any[];

		const tree = buildProjectTree(nodes, macros, 'model.pkg.orders');

		// root package folder
		const pkg = tree.find((t) => t.name === 'pkg');
		expect(pkg).toBeDefined();
		expect(isFolder(pkg!)).toBe(true);
		expect(pkg!.active).toBe(true); // active propagates

		// models/core folder
		const models = (pkg as TreeFolder<any>).items.find((i) => i.name === 'models');
		expect(isFolder(models!)).toBe(true);

		const core = (models as TreeFolder<any>).items.find((i) => i.name === 'core');
		expect(isFolder(core!)).toBe(true);
		expect(core!.active).toBe(true);

		const ordersFile = (core as TreeFolder<any>).items.find(
			(i) => i.type === 'file' && i.name === 'orders_v2'
		);
		expect(ordersFile).toBeDefined();
		expect(ordersFile!.active).toBe(true);

		// analysis folder
		const analysis = (pkg as TreeFolder<any>).items.find((i) => i.name === 'analysis');
		expect(isFolder(analysis!)).toBe(true);

		const analysisFile = (analysis as TreeFolder<any>).items.find(
			(i) => i.type === 'file' && i.name === 'revenue_analysis'
		);
		expect(analysisFile).toBeDefined();
		expect(analysisFile!.active).toBe(false);

		// macros folder (uses macro name, not filename)
		const macrosFolder = (pkg as TreeFolder<any>).items.find((i) => i.name === 'macros');
		expect(isFolder(macrosFolder!)).toBe(true);

		const utils = (macrosFolder as TreeFolder<any>).items.find((i) => i.name === 'utils');
		expect(isFolder(utils!)).toBe(true);

		const macroFile = (utils as TreeFolder<any>).items.find(
			(i) => i.type === 'file' && i.name === 'do_something'
		) as TreeFile<any>;
		expect(macroFile).toBeDefined();
		expect(macroFile.node_type).toBe('macro');

		// exclusions
		const flatNames = JSON.stringify(tree);
		expect(flatNames).not.toContain('hidden_model');
		expect(flatNames).not.toContain('metric1');
	});

	it('handles empty input gracefully', () => {
		const tree = buildProjectTree();
		expect(tree).toEqual([]);
	});
});

describe('buildDatabaseTree', () => {
	it('builds a database → schema → table tree with filtering, grouping, and active propagation', () => {
		const nodes = [
			// source
			{
				name: 'source_a',
				resource_type: 'source',
				database: 'db1',
				schema: 'public',
				unique_id: 'source.source_a',
			},

			// visible model (active)
			{
				name: 'model_a',
				resource_type: 'model',
				database: 'db1',
				schema: 'public',
				config: { materialized: 'table' },
				unique_id: 'model.model_a',
			},

			// ephemeral model (excluded)
			{
				name: 'model_ephemeral',
				resource_type: 'model',
				database: 'db1',
				schema: 'public',
				config: { materialized: 'ephemeral' },
				unique_id: 'model.ephemeral',
			},

			// hidden model (excluded)
			{
				name: 'model_hidden',
				resource_type: 'model',
				database: 'db1',
				schema: 'public',
				config: { materialized: 'table' },
				docs: { show: false },
				unique_id: 'model.hidden',
			},

			// seed with alias
			{
				name: 'seed_a',
				alias: 'seed_alias',
				resource_type: 'seed',
				database: 'db1',
				schema: 'analytics',
				unique_id: 'seed.seed_a',
			},

			// snapshot with identifier
			{
				name: 'snap_a',
				identifier: 'snap_identifier',
				alias: 'snap_alias',
				resource_type: 'snapshot',
				database: 'db2',
				schema: 'snapshots',
				unique_id: 'snapshot.snap_a',
			},

			// model with no database/schema (defaults)
			{
				name: 'model_default',
				resource_type: 'model',
				config: { materialized: 'table' },
				unique_id: 'model.default',
			},
		] as any[];

		const tree = buildDatabaseTree(nodes, 'model.model_a');

		// databases
		expect(tree.map((t) => t.name)).toEqual(expect.arrayContaining(['db1', 'db2', 'Default']));

		const db1 = tree.find((t) => t.name === 'db1')!;
		expect(isFolder(db1)).toBe(true);
		expect(db1.active).toBe(true); // active model propagates

		// schemas
		const publicSchema = db1.items.find((i) => isFolder(i) && i.name === 'public')!;
		assertFolder(publicSchema);
		expect(publicSchema.active).toBe(true);

		const analyticsSchema = db1.items.find((i) => isFolder(i) && i.name === 'analytics')!;
		assertFolder(analyticsSchema);

		//  tables
		const publicTables = publicSchema.items;
		const tableNames = publicTables.map((t) => t.name);

		expect(tableNames).toEqual(expect.arrayContaining(['model_a', 'source_a']));

		// excluded models
		expect(tableNames).not.toContain('model_ephemeral');
		expect(tableNames).not.toContain('model_hidden');

		const activeTable = publicTables.find(
			(t) => 'unique_id' in t && t.unique_id === 'model.model_a'
		)!;
		expect(activeTable.active).toBe(true);

		// alias preferred over name
		const seedTable = analyticsSchema.items.find(
			(t) => 'unique_id' in t && t.unique_id === 'seed.seed_a'
		)!;
		expect(seedTable.name).toBe('seed_alias');

		// identifier preferred over name and alias
		const db2 = tree.find((t) => t.name === 'db2')!;
		const snapSchema = db2.items.find((i) => isFolder(i))!;
		expect(snapSchema.items[0]!.name).toBe('snap_identifier');

		// defaults
		const defaultDb = tree.find((t) => t.name === 'Default')!;
		const defaultSchema = defaultDb.items.find((i) => isFolder(i) && i.name === 'public')!;
		assertFolder(defaultSchema);
		expect(defaultSchema.items[0]!.name).toBe('model_default');
	});

	it('handles empty input gracefully', () => {
		const tree = buildDatabaseTree([], undefined);
		expect(tree).toEqual([]);
	});
});

describe('buildGroupTree', () => {
	it('handles grouping, ungrouped nodes, and active selection', () => {
		const nodes = [
			// normal grouped models
			{ name: 'm1', resource_type: 'model', group: 'grp1', unique_id: 'model.m1' },
			{ name: 'm2', resource_type: 'model', group: 'grp1', unique_id: 'model.m2' },

			// no group -> Ungrouped
			{ name: 'm3', resource_type: 'model', unique_id: 'model.m3' },

			// protected model
			{
				name: 'm4',
				resource_type: 'model',
				group: 'grp2',
				access: 'protected',
				unique_id: 'model.m4',
			},

			// private model -> skipped
			{
				name: 'm5',
				resource_type: 'model',
				group: 'grp2',
				access: 'private',
				unique_id: 'model.m5',
			},

			// non-model resources -> skipped
			{ name: 's1', resource_type: 'source', unique_id: 'source.s1' },
			{ name: 'e1', resource_type: 'exposure', unique_id: 'exposure.e1' },
			{ name: 'seed1', resource_type: 'seed', unique_id: 'seed.seed1' },
		] as any;

		const tree = buildGroupTree(nodes, 'model.m2');

		// grp1 should exist with m1, m2
		const grp1 = tree.find((t) => t.name === 'grp1')!;
		expect(isFolder(grp1)).toBe(true);
		expect(grp1.items.map((i) => i.name)).toEqual(['m1', 'm2']);
		expect(grp1.active).toBe(true); // m2 selected
		expect(grp1.items.find((i) => i.name === 'm2')!.active).toBe(true);

		// Ungrouped should contain m3
		const ungrouped = tree.find((t) => t.name === 'Ungrouped')!;
		expect(isFolder(ungrouped)).toBe(true);
		expect(ungrouped.items.map((i) => i.name)).toEqual(['m3']);
		expect(ungrouped.active).toBe(false);

		// grp2 should contain protected m4 with "(protected)"
		const grp2 = tree.find((t) => t.name === 'grp2')!;
		expect(isFolder(grp2)).toBe(true);
		expect(grp2.items.map((i) => i.name)).toEqual(['m4 (protected)']);
		expect(grp2.active).toBe(false);

		// skipped private and non-model nodes should not appear
		expect(tree.some((t) => t.items.some((i) => i.name === 'm5'))).toBe(false);
		expect(tree.some((t) => t.items.some((i) => i.name === 's1'))).toBe(false);
		expect(tree.some((t) => t.items.some((i) => i.name === 'e1'))).toBe(false);
		expect(tree.some((t) => t.items.some((i) => i.name === 'seed1'))).toBe(false);
	});

	it('handles empty input gracefully', () => {
		const tree = buildGroupTree([], undefined);
		expect(tree).toEqual([]);
	});

	it('marks Ungrouped node active if selected', () => {
		const nodes = [{ name: 'm1', resource_type: 'model', unique_id: 'model.m1' }] as any;
		const tree = buildGroupTree(nodes, 'model.m1');
		const ungrouped = tree.find((t) => t.name === 'Ungrouped')!;
		expect(ungrouped.active).toBe(true);
		expect(ungrouped.items[0]!.active).toBe(true);
	});
});

describe('populateNodeMap', () => {
	it('should flatten a nested tree into a single lookup record', () => {
		const mockTree = [
			{
				type: 'folder',
				name: 'models',
				active: false,
				items: [
					{
						type: 'file',
						unique_id: 'model.a',
						name: 'Model A',
						node: { id: 'a' },
						active: false,
						node_type: 'model',
					},
				],
			},
			{
				type: 'file',
				unique_id: 'seed.b',
				name: 'Seed B',
				node: { id: 'b' },
				active: true,
				node_type: 'seed',
			},
		];

		const result = populateNodeMap(mockTree as any);

		// Verify O(1) style lookups
		expect(result['model.a']).toBeDefined();
		expect(result['model.a']!.name).toBe('Model A');
		expect(result['seed.b']).toBeDefined();
		expect(result['seed.b']!.node_type).toBe('seed');

		// Ensure folders themselves aren't keys
		expect(Object.keys(result)).toHaveLength(2);
		expect(result['models']).toBeUndefined();
	});

	it('should return an empty object when passed an empty tree', () => {
		const result = populateNodeMap([]);
		expect(result).toEqual({});
	});

	it('should handle deeply nested folders', () => {
		const deepTree = [
			{
				type: 'folder',
				name: 'level1',
				active: false,
				items: [
					{
						type: 'folder',
						name: 'level2',
						active: false,
						items: [
							{
								type: 'file',
								unique_id: 'deep.node',
								name: 'Deep',
								node: {},
								active: false,
								node_type: 'model',
							},
						],
					},
				],
			},
		];

		const result = populateNodeMap(deepTree as any);
		expect(result['deep.node']).toBeDefined();
	});
});
