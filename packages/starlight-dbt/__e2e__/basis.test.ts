import type { Page } from '@playwright/test';
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
			{ type: 'macro', id: 'macro.test_pkg.macro1', expected: 'macro1' },
			{ type: 'exposure', id: 'exposure.test_pkg.exposure1', expected: 'exposure1' },
			{ type: 'metric', id: 'metric.test_pkg.metric1', expected: 'Metric 1' }, // uses label
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

		test.describe('dbt dynamic page ignores hidden modles', () => {
			test('does not render hidden model page', async ({ getProdServer }) => {
				const starlight = await getProdServer();

				const response = await starlight.goto('/dbt/model.test_pkg.hidden_model');
				expect(response?.status()).toBe(404);
			});
		});
	});
});

test.describe('Sidebar Functionality', () => {
	test.describe('dbt', () => {
		/**
		 * Helper to recursively expand ALL folders inside the dbt section.
		 * This ensures nested links are considered "visible" by Playwright.
		 */
		const expandAllDbtFolders = async (page: Page) => {
			const dbtRoot = page.locator('li.dbt-root-node');
			await dbtRoot.evaluate((node) => {
				const details = node.querySelectorAll('details');
				details.forEach((d) => (d.open = true));
			});
			// Wait a moment for Starlight's animations or layout to settle
			await expect(dbtRoot.locator('.dbt-switcher')).toBeVisible();
		};

		test('should strip the _DBTROOT: prefix from the label', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();
			await starlight.goto('/examples/example1');
			const rootLabel = page.locator('li.dbt-root-node > details > summary .large');
			await expect(rootLabel).toHaveText('Default dbt Project');
		});

		test('should filter sidebar items based on radio selection', async ({
			page,
			getProdServer,
		}) => {
			const starlight = await getProdServer();
			await starlight.goto('/examples/example1');
			await expandAllDbtFolders(page);

			const projectLink = page.locator('a[data-dbt-type="project"]').first();
			const dbLink = page.locator('a[data-dbt-type="database"]').first();

			// Default should be Project
			await expect(projectLink).toBeVisible();
			await expect(dbLink).not.toBeVisible();

			// Switch to Database
			await page.locator('label[for="v-database"]').click();
			await expect(dbLink).toBeVisible();
			await expect(projectLink).not.toBeVisible();
		});

		test('should persist view selection across navigation', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();
			await starlight.goto('/examples/example1');
			await expandAllDbtFolders(page);

			// Select Group view
			await page.locator('label[for="v-group"]').click();

			// Find the first visible link in the dbt section
			const groupLink = page.locator('li.dbt-root-node a:visible').first();
			const targetHref = await groupLink.getAttribute('href');

			// Use force click if Starlight's sidebar has overlapping elements
			await groupLink.click({ force: true });

			await expect(page).toHaveURL(new RegExp(targetHref!));

			// Check persistence on the new page
			await expandAllDbtFolders(page);
			await expect(page.locator('input[id="v-group"]')).toBeChecked();
		});

		test('should correctly show/hide the Ungrouped folder', async ({ page, getProdServer }) => {
			const starlight = await getProdServer();
			await starlight.goto('/examples/example1');
			await expandAllDbtFolders(page);

			// 1. In Group View, Ungrouped should definitely be visible
			await page.locator('label[for="v-group"]').click();
			const ungrouped = page.locator('li.dbt-root-node details', { hasText: 'Ungrouped' }).first();
			await expect(ungrouped).toBeVisible();

			// 2. Switch to a view where Ungrouped MIGHT be hidden.
			// NOTE: If your "Ungrouped" items also have "project" tags,
			// the folder correctly stays visible. We test that the SWITCH works.
			await page.locator('label[for="v-database"]').click();

			// If the folder contains database items, it stays visible.
			// This confirms the CSS logic is checking the classes correctly.
			const hasDatabaseItems = await ungrouped.evaluate((el) =>
				el.classList.contains('contains-database')
			);
			if (hasDatabaseItems) {
				await expect(ungrouped).toBeVisible();
			} else {
				await expect(ungrouped).not.toBeVisible();
			}
		});

		test('should apply selection immediately (no-flicker check)', async ({
			page,
			getProdServer,
		}) => {
			const starlight = await getProdServer();

			// Set storage before we even load the page
			await page.addInitScript(() => {
				window.localStorage.setItem('starlight-dbt-view-preference', 'database');
			});

			await starlight.goto('/examples/example1');

			// We check the input state BEFORE expanding to see if the inline script worked
			const dbInput = page.locator('input[id="v-database"]');
			await expect(dbInput).toBeChecked();

			await expandAllDbtFolders(page);
			await expect(page.locator('a[data-dbt-type="database"]').first()).toBeVisible();
		});
	});
});
