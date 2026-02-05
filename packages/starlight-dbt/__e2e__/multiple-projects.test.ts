import { expect, testFactory, expandAllDbtFolders } from './test-utils';

const test = testFactory('./fixtures/multiple-projects/');

test.describe('Multiple Project Isolation', () => {
	// Helper to find the root node for a specific project ID
	const getProjectRoot = (page: any, id: string) =>
		page.locator('li.dbt-root-node').filter({
			has: page.locator(`.dbt-switcher[data-project-id="dbt-${id}"]`),
		});

	test.beforeEach(async ({ page, getProdServer }) => {
		const starlight = await getProdServer();
		await starlight.goto('/examples/example1');
		await expandAllDbtFolders(page);
	});

	test('should allow independent view states for different projects', async ({ page }) => {
		const p1Root = getProjectRoot(page, 'project1');
		// We target 'subprojecta' because 'project2' is just a container folder
		const p2aRoot = getProjectRoot(page, 'project2-subprojecta');

		// Switch Project 1 to 'Database'
		await p1Root.locator('label[for^="v-database-"]').click();

		// Project 1 updated, Subproject A remained in 'Project'
		await expect(p1Root.locator('input[value="database"]')).toBeChecked();
		await expect(p2aRoot.locator('input[value="project"]')).toBeChecked();

		// Check visibility isolation
		await expect(p1Root.locator('a[data-dbt-type="database"]').first()).toBeVisible();
		await expect(p2aRoot.locator('a[data-dbt-type="database"]').first()).toBeHidden();
	});

	test('should persist unique preferences for each project across reloads', async ({
		page,
		getProdServer,
	}) => {
		const starlight = await getProdServer();
		const p1Root = getProjectRoot(page, 'project1');
		const p2aRoot = getProjectRoot(page, 'project2-subprojecta');

		// Set P1 to Group, P2a to Database
		await p1Root.locator('label[for^="v-group-"]').click();
		await p2aRoot.locator('label[for^="v-database-"]').click();

		// Reload the page
		await starlight.goto('/examples/example1');
		await expandAllDbtFolders(page);

		// Asert both maintained their distinct choices
		await expect(getProjectRoot(page, 'project1').locator('input[value="group"]')).toBeChecked();
		await expect(
			getProjectRoot(page, 'project2-subprojecta').locator('input[value="database"]')
		).toBeChecked();
	});

	test('should apply different pre-set storage keys without interference (flicker check)', async ({
		page,
		getProdServer,
	}) => {
		const starlight = await getProdServer();

		// Inject the storage keys
		await page.addInitScript(() => {
			window.localStorage.setItem('dbt-view-pref-dbt-project1', 'group');
			window.localStorage.setItem('dbt-view-pref-dbt-project2-subprojecta', 'database');
		});

		await starlight.goto('/examples/example1');

		const p1Input = getProjectRoot(page, 'project1').locator('input[value="group"]');
		const p2aInput = getProjectRoot(page, 'project2-subprojecta').locator(
			'input[value="database"]'
		);

		await expect(p1Input).toBeChecked();
		await expect(p2aInput).toBeChecked();

		await expandAllDbtFolders(page);
		await expect(
			getProjectRoot(page, 'project1').locator('a[data-dbt-type="project"]').first()
		).toBeHidden();
		await expect(
			getProjectRoot(page, 'project2-subprojecta').locator('a[data-dbt-type="database"]').first()
		).toBeVisible();
	});

	test('should handle isolation between sibling subprojects in the same group', async ({
		page,
	}) => {
		const p2aRoot = getProjectRoot(page, 'project2-subprojecta');
		const p2bRoot = getProjectRoot(page, 'project2-subprojectb');

		// Switch Subproject A only
		await p2aRoot.locator('label[for^="v-database-"]').click();

		await expect(p2aRoot.locator('input[value="database"]')).toBeChecked();
		await expect(p2bRoot.locator('input[value="project"]')).toBeChecked();
	});
});
