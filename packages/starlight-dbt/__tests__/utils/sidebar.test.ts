import * as fsPromises from 'node:fs/promises';
import path from 'node:path';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import { dbtRootIdentifierPrefix } from '../../constants';
import * as manager from '../../lib/manager';
import { getDbtSidebar, resolveDbtSidebar } from '../../lib/utils/sidebar';

import type { StarlightDbtOptions } from '../../config';
import type { DbtService } from '../../lib/service/types';

// Mock the external modules
vi.mock('node:fs/promises');
vi.mock('../../lib/manager');

describe('sidebar utils', () => {
	const mockBaseDir = 'src/content/dbt';
	const mockBaseUrl = '/dbt';
	const mockRoot = '/root/';

	const config = { baseDir: mockBaseDir, baseUrl: mockBaseUrl } as StarlightDbtOptions;
	const astroConfig = { root: { pathname: mockRoot } } as any;

	beforeEach(() => {
		vi.resetAllMocks();
	});

	describe('getDbtSidebar()', () => {
		it('should build a combined sidebar from database, project, and group trees', () => {
			const mockService = {
				tree: {
					database: [{ name: 'DB Node', unique_id: 'db_1' }],
					project: [{ name: 'Folder', items: [{ name: 'Model', unique_id: 'm_1' }] }],
					groups: [{ name: 'Grp', unique_id: 'g_1' }],
				},
			} as unknown as DbtService;

			const sidebar = getDbtSidebar(mockService, '/dbt/project-a', 'Project A');

			expect((sidebar as any).label).toBe(`${dbtRootIdentifierPrefix}Project A`);
			expect((sidebar as any).items).toHaveLength(3);
			expect((sidebar as any).items[0]).toMatchObject({
				label: 'DB Node',
				link: '/dbt/project-a/db_1',
			});
		});

		it('should handle URL normalization (slashes)', () => {
			const mockService = {
				tree: { database: [{ name: 'N', unique_id: 'id' }], project: [], groups: [] },
			} as any;
			// Test with trailing slash in baseUrl
			const sidebar = getDbtSidebar(mockService, 'dbt/proj/', 'P');
			const item = (sidebar as any).items[0];
			expect(item.link).toBe('/dbt/proj/id');
		});
	});

	describe('scanDbtDirectory()', () => {
		it('should recursively find projects and stop recursion at manifest.json', async () => {
			const parentPath = path.join(mockRoot, mockBaseDir, 'parent');

			vi.mocked(fsPromises.readdir).mockImplementation(async (p: any) => {
				let results: any[] = [];
				if (p === parentPath) {
					results = [mockDir('child_a'), mockDir('child_b')];
				} else if (p.includes('child_b')) {
					results = [mockDir('subchild')];
				}
				return results as any;
			});

			vi.mocked(fsPromises.access).mockImplementation(async (p: any) => {
				const pathStr = String(p);
				// 1. Allow the directory existence check to pass
				if (pathStr === parentPath) return Promise.resolve();
				// 2. Allow sub-directories checked during recursion to pass
				if (
					pathStr.includes('child_a') ||
					pathStr.includes('child_b') ||
					pathStr.includes('subchild')
				) {
					// Only return manifest success for specific files
					if (pathStr.endsWith('manifest.json')) {
						if (pathStr.includes('child_a') || pathStr.includes('subchild'))
							return Promise.resolve();
						return Promise.reject(new Error('no manifest here'));
					}
					return Promise.resolve(); // The directory itself exists
				}
				return Promise.reject(new Error('path not found'));
			});

			vi.mocked(manager.getOrInitDbtService).mockResolvedValue({
				tree: { database: [], project: [], groups: [] },
			} as any);

			const items = [{ autogenerate: { directory: 'parent', dbt: true }, label: 'Auto' }] as any;
			const out = await resolveDbtSidebar(items, config, astroConfig);

			const autoGroup = out[0] as any;
			expect(autoGroup.items).toHaveLength(2);
			expect(autoGroup.items[0].label).toContain('child_a');
			expect(autoGroup.items[1].label).toBe('child_b');
		});

		it('should sort items alphabetically', async () => {
			const fullPath = path.join(mockRoot, mockBaseDir, 'dir');

			vi.mocked(fsPromises.access).mockImplementation(async (p: any) => {
				const pathStr = String(p);
				// 1. Let directory checks pass
				if (!pathStr.endsWith('manifest.json')) return Promise.resolve();

				// 2. Allow the deep project manifests to exist so 'a' and 'z' aren't pruned
				if (pathStr.includes('proj_z') || pathStr.includes('proj_a')) {
					return Promise.resolve();
				}

				// 3. Fail other manifest checks
				return Promise.reject(new Error('no manifest here'));
			});

			vi.mocked(fsPromises.readdir).mockImplementation(async (p: any) => {
				const pathStr = String(p);
				if (pathStr === fullPath) {
					return [mockDir('z'), mockDir('a')] as any;
				}
				// Provide project folders inside 'a' and 'z'
				if (pathStr.endsWith('/a')) {
					return [mockDir('proj_a')] as any;
				}
				if (pathStr.endsWith('/z')) {
					return [mockDir('proj_z')] as any;
				}
				return [] as any;
			});

			// Ensure the service initialization doesn't throw
			vi.mocked(manager.getOrInitDbtService).mockResolvedValue({
				tree: { database: [], project: [], groups: [] },
			} as any);

			const out = await resolveDbtSidebar(
				[{ autogenerate: { directory: 'dir', dbt: true } }] as any,
				config,
				astroConfig
			);

			const autoGroup = out[0] as any;

			// Now autoGroup.items will have length 2 because 'a' and 'z' found projects
			expect(autoGroup.items).toHaveLength(2);
			expect(autoGroup.items[0].label).toBe('a');
			expect(autoGroup.items[1].label).toBe('z');
		});

		it('should skip hidden files and non-directory entries', async () => {
			const fullPath = path.join(mockRoot, mockBaseDir, 'mixed-content');

			// ENSURE EXISTENCE CHECK PASSES
			vi.mocked(fsPromises.access).mockImplementation(async (p: any) => {
				const pathStr = String(p);
				if (pathStr === fullPath) return Promise.resolve(); // Entry dir exists
				if (pathStr.includes('valid_project/manifest.json')) return Promise.resolve();
				return Promise.reject(new Error());
			});

			vi.mocked(fsPromises.readdir).mockImplementation(async (p: any) => {
				if (String(p) === fullPath) {
					return [
						{ name: 'README.md', isDirectory: () => false },
						{ name: '.git', isDirectory: () => true },
						{ name: 'valid_project', isDirectory: () => true },
					] as any;
				}
				return [];
			});

			vi.mocked(manager.getOrInitDbtService).mockResolvedValue({
				tree: { database: [], project: [], groups: [] },
			} as any);

			const out = await resolveDbtSidebar(
				[{ autogenerate: { directory: 'mixed-content', dbt: true } }] as any,
				config,
				astroConfig
			);

			const autoGroup = out[0] as any;
			expect(autoGroup.items).toHaveLength(1);
			expect(autoGroup.items[0].label).toContain('valid_project');
		});

		it('should stop and warn when MAX_DEPTH is exceeded', async () => {
			const logger = { warn: vi.fn() } as any;
			const startDir = 'deep-nest';
			// const fullPath = path.join(mockRoot, mockBaseDir, startDir);

			// ENSURE EXISTENCE CHECK PASSES
			vi.mocked(fsPromises.access).mockImplementation(async (p: any) => {
				if (!String(p).endsWith('manifest.json')) return Promise.resolve();
				return Promise.reject(new Error());
			});

			vi.mocked(fsPromises.readdir).mockResolvedValue([
				{ name: 'level', isDirectory: () => true },
			] as any);

			await resolveDbtSidebar(
				[{ autogenerate: { directory: startDir, dbt: true } }] as any,
				config,
				astroConfig,
				logger
			);

			expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('Max depth reached'));
		});
	});

	describe('resolveDbtSidebar()', () => {
		it('should recurse into manual sidebar groups', async () => {
			const items = [
				{
					label: 'Manual',
					items: [{ label: 'Normal Link', slug: 'link' }],
				},
			] as any;

			const out = await resolveDbtSidebar(items, config, astroConfig);
			expect((out[0]! as any).items[0].label).toBe('Normal Link');
		});

		it('should throw error if autogenerate directory does not exist', async () => {
			vi.mocked(fsPromises.access).mockRejectedValue(new Error('ENOENT'));
			const items = [{ autogenerate: { directory: 'invalid', dbt: true } }] as any;

			await expect(resolveDbtSidebar(items, config, astroConfig)).rejects.toThrow(/does not exist/);
		});

		it('should warn if autogenerate finds no projects', async () => {
			const logger = { warn: vi.fn(), info: vi.fn(), error: vi.fn() } as any;
			vi.mocked(fsPromises.access).mockResolvedValue(); // Dir exists
			vi.mocked(fsPromises.readdir).mockResolvedValue([]); // But empty

			const items = [{ autogenerate: { directory: 'empty', dbt: true } }] as any;
			await resolveDbtSidebar(items, config, astroConfig, logger);

			expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('No dbt projects'));
		});

		it('should expand explicit dbt links if manifest exists', async () => {
			const items = [{ label: 'Manual Proj', slug: 'my-proj', dbt: true }] as any;
			vi.mocked(fsPromises.access).mockResolvedValue(); // Manifest exists
			vi.mocked(manager.getOrInitDbtService).mockResolvedValue({
				tree: { database: [], project: [], groups: [] },
			} as any);

			const out = await resolveDbtSidebar(items, config, astroConfig);
			expect((out[0]! as any).label).toContain('Manual Proj');
		});

		it('should log error and fallback to normal link if explicit dbt manifest is missing', async () => {
			const logger = { error: vi.fn() } as any;
			const items = [{ label: 'Broken', slug: 'broken', dbt: true }] as any;
			vi.mocked(fsPromises.access).mockRejectedValue(new Error()); // No manifest

			const out = await resolveDbtSidebar(items, config, astroConfig, logger);

			expect(logger.error).toHaveBeenCalled();
			expect(out[0]).not.toHaveProperty('dbt');
			expect((out[0]! as any).label).toBe('Broken');
		});
	});
});

/** Helper to mock fs.Dirent */
function mockDir(name: string) {
	return {
		name,
		isDirectory: () => true,
	};
}
