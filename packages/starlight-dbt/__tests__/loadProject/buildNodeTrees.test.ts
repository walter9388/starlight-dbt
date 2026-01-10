import { describe, it, expect } from 'vitest';

import { buildExposureTree } from '../../utils/load/buildNodeTrees';

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
