import { expect, testFactory } from './test-utils';

const test = testFactory('./fixtures/basics/');

test.describe('Pages', () => {
	test.describe('Starlight', () => {
		test('confirm starlight example.md page renders correctly', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();

			// 1. Navigate and capture the response
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
});
