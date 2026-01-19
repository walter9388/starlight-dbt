import { expect, testFactory } from './test-utils';

const test = testFactory('./fixtures/basics/');

test.describe('Pages', () => {
	test.describe('Starlight', () => {
		test('confirm starlight example.md page renders correctly', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();

			// Navigate and capture the response
			const response = await starlight.goto('/examples/example1');
			expect(response?.ok()).toBe(true);

			// Ensure the Markdown heading exists
			const heading = page.locator('h1');
			await expect(heading).toContainText('Example1');
		});

		test('renders a 404 for non-existent routes', async ({ getProdServer }) => {
			const starlight = await getProdServer();
			const response = await starlight.goto('/this-page-does-not-exist');

			// Confirm the status is actually 404
			expect(response?.status()).toBe(404);
		});
	});

	test.describe('dbt', () => {
		const dbtTestCases = [
			{ type: 'model', id: 'model.test_pkg.model_node', expected: 'model_node' },
			{ type: 'snapshot', id: 'snapshot.test_pkg.snapshot_node', expected: 'snapshot_node' },
			{ type: 'seed', id: 'seed.test_pkg.seed_node', expected: 'seed_node' },
			{ type: 'source', id: 'source.test_pkg.s1.source1', expected: 'source1' },
			{ type: 'analysis', id: 'analysis.test_pkg.analysis_node', expected: 'analysis_node' },
			{
				type: 'protected model',
				id: 'model.test_pkg.protected_model',
				expected: 'protected_model',
			},
			{ type: 'private model', id: 'model.test_pkg.private_model', expected: 'private_model' },
			{ type: 'hidden model', id: 'model.test_pkg.hidden_node', expected: 'hidden_node' },
			{ type: 'macro', id: 'macro.test_pkg.macro1', expected: 'macro1' },
			{ type: 'exposure', id: 'exposure.test_pkg.exposure1', expected: 'exposure1' },
			{ type: 'metric', id: 'metric.test_pkg.metric1', expected: 'metric1' },
			{ type: 'semantic model', id: 'semantic_model.test_pkg.sm1', expected: 'sm1' },
			{ type: 'saved query', id: 'saved_query.test_pkg.sq1', expected: 'sq1' },
			{ type: 'unit test', id: 'unit_test.test_pkg.unit_test_1', expected: 'unit_test_1' },
		];

		test.describe('dbt dynamic page renders', () => {
			for (const { type, id, expected } of dbtTestCases) {
				test(`renders a dbt ${type} page (${id})`, async ({ page, getProdServer }) => {
					const starlight = await getProdServer();

					const response = await starlight.goto(`/dbt/${id}`);
					expect(response?.ok()).toBe(true);

					const heading = page.locator('h1');
					await expect(heading).toContainText(expected);
				});
			}
		});
	});
});
