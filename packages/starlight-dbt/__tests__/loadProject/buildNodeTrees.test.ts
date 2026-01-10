import { describe, it, expect } from 'vitest';

import {
	buildExposureTree,
	buildMetricTree,
	buildSemanticModelTree,
} from '../../utils/load/buildNodeTrees';

describe('buildExposureTree', () => {
	it('groups exposures by type, sorts and marks active selection', () => {
		const nodes: any[] = [
			{ name: 'exp_a', label: 'A', type: 'dashboard', unique_id: 'exp.pkg.exp_a' },
			{ name: 'exp_b', label: 'B', type: 'report', unique_id: 'exp.pkg.exp_b' },
			{ name: 'exp_c', label: 'C', type: 'dashboard', unique_id: 'exp.pkg.exp_c' },
			{ name: 'exp_d', unique_id: 'exp.pkg.exp_d' },
		];

		const tree = buildExposureTree(nodes, 'exp.pkg.exp_c');

		// Should create folders for Dashboard, Report, Uncategorized
		expect(tree.map((t) => t.name)).toEqual(
			expect.arrayContaining(['Dashboard', 'Report', 'Uncategorized'])
		);

		const dashboard = tree.find((t) => t.name === 'Dashboard')!;
		expect(dashboard).toBeDefined();
		expect(dashboard.active).toBe(true); // exp_c selected
		expect(dashboard.items).toHaveLength(2);

		const firstItemNames = (dashboard.items as any[]).map((i) => i.name);
		expect(firstItemNames).toEqual(['A', 'C']);

		const uncategorized = tree.find((t) => t.name === 'Uncategorized')!;
		expect(uncategorized.items).toHaveLength(1);
		expect(uncategorized.items![0]!.name).toBe('exp_d');
	});
});

describe('buildMetricTree', () => {
	it('groups metrics by package_name, sorts and marks active selection', () => {
		const nodes: any[] = [
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
			{ name: 'metric_c', package_name: 'pkg1', unique_id: 'metric.pkg1.metric_c' },
		];

		const tree = buildMetricTree(nodes, 'metric.pkg1.metric_c');

		// Should create folders for pkg1 and pkg2
		expect(tree.map((t) => t.name)).toEqual(expect.arrayContaining(['pkg1', 'pkg2']));

		const pkg1 = tree.find((t) => t.name === 'pkg1')!;
		expect(pkg1).toBeDefined();
		expect(pkg1.active).toBe(true); // metric_c is selected
		expect(pkg1.items).toHaveLength(2);
		expect(pkg1.items?.find((t) => t.name === 'metric_c')!.active).toBe(true);

		const itemNames = (pkg1.items as any[]).map((i) => i.name);
		expect(itemNames).toEqual(['Metric A', 'metric_c']); // sorted, metric_a uses label

		const pkg2 = tree.find((t) => t.name === 'pkg2')!;
		expect(pkg2.active).toBe(false);
		expect(pkg2.items![0]!.active).toBe(false);
	});
});

describe('buildSemanticModelTree', () => {
	it('groups semantic models by package_name, sorts and marks active selection', () => {
		const nodes: any[] = [
			{ name: 'model_a', package_name: 'pkg1', unique_id: 'sm.pkg1.model_a' },
			{ name: 'model_b', package_name: 'pkg2', unique_id: 'sm.pkg2.model_b' },
			{ name: 'model_c', package_name: 'pkg1', unique_id: 'sm.pkg1.model_c' },
		];

		const tree = buildSemanticModelTree(nodes, 'sm.pkg1.model_c');

		// Should create folders for pkg1 and pkg2
		expect(tree.map((t) => t.name)).toEqual(expect.arrayContaining(['pkg1', 'pkg2']));

		const pkg1 = tree.find((t) => t.name === 'pkg1')!;
		expect(pkg1).toBeDefined();
		expect(pkg1.active).toBe(true); // model_c is selected
		expect(pkg1.items).toHaveLength(2);
		expect(pkg1.items?.find((t) => t.name === 'model_c')!.active).toBe(true);

		const itemNames = (pkg1.items as any[]).map((i) => i.name);
		expect(itemNames).toEqual(['model_a', 'model_c']); // sorted by name

		const pkg2 = tree.find((t) => t.name === 'pkg2')!;
		expect(pkg2.active).toBe(false);
		expect(pkg2.items![0]!.active).toBe(false);
	});
});
