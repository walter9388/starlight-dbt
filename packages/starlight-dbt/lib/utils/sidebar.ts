import fs from 'node:fs/promises';
import path from 'node:path';

import { _SEP, dbtRootIdentifierPrefix } from '../../constants';
import { getOrInitDbtService } from '../manager';

import type { DbtSidebarItem, StarlightDbtOptions } from '../../config';
import type { LinkHTMLAttributes } from '../../starlight-internals/schemas/sidebar';
import type { ProjectNode, TreeItem, MacroValues, DbtService } from '../service/types';
import type { SidebarEntry, SidebarItem } from '../types';
import type { AstroConfig, AstroIntegrationLogger } from 'astro';

/**
 * Build a SidebarItem representing a dbt project tree.
 *
 * Combines database, project, and group trees from the provided
 * `DbtService` into a single collapsed sidebar entry prefixed with the
 * global dbt root identifier.
 *
 * @param service - Initialized dbt service containing tree data
 * @param baseUrl - Base URL (slug) for links to dbt nodes
 * @param label - Human-readable label for the project
 * @param attrs - Html attributes defined in sidebar
 * @returns SidebarItem containing nested dbt items
 */
export const getDbtSidebar = (
	service: DbtService,
	baseUrl: string,
	label: string,
	attrs?: LinkHTMLAttributes
): SidebarItem => {
	const dbtDatabaseSidebar = extractSidebar(service.tree.database, baseUrl, 'database', attrs);
	const dbtProjectSidebar = extractSidebar(service.tree.project, baseUrl, 'project', attrs);
	const dbtGroupsSidebar = extractSidebar(service.tree.groups, baseUrl, 'group', attrs);
	return {
		label: dbtRootIdentifierPrefix + baseUrl + _SEP + label,
		items: [...dbtDatabaseSidebar, ...dbtProjectSidebar, ...dbtGroupsSidebar],
		collapsed: true,
	};
};

/**
 * Convert a tree of project nodes into SidebarItems.
 *
 * Recursively maps folder-like tree items to nested sidebar groups and
 * leaf nodes to direct links. The returned links are built from the
 * provided `baseUrl` and each node's `unique_id`.
 *
 * @param tree - Tree of project nodes or macros
 * @param baseUrl - Base path used to build item links
 * @param dbtTreeDataIdentifer - Identifier for data-dbt-type attribute
 * @param attrs - Html attributes defined in sidebar (optional)
 * @returns Array of SidebarItem entries
 */
function extractSidebar(
	tree: TreeItem<ProjectNode | MacroValues>[],
	baseUrl: string,
	dbtTreeDataIdentifer: 'project' | 'database' | 'group',
	attrs?: LinkHTMLAttributes
): SidebarItem[] {
	const normalizedBase = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
	const cleanBase = normalizedBase.endsWith('/') ? normalizedBase.slice(0, -1) : normalizedBase;

	return tree.map((item) => {
		if ('items' in item) {
			return {
				label: item.name,
				items: extractSidebar(item.items, baseUrl, dbtTreeDataIdentifer, attrs),
				collapsed: true,
			};
		}

		return {
			label: item.name,
			link: `${cleanBase}/${item.unique_id}`,
			attrs: {
				'data-dbt-type': dbtTreeDataIdentifer,
				class: attrs?.class ? attrs.class + ' ' : '' + 'dbt-item',
				...attrs,
			},
		};
	});
}

/**
 * Generate a collapsed SidebarItem for a dbt project directory.
 *
 * Initializes or retrieves a cached dbt service for the provided manifest
 * and returns the sidebar entry produced by `getDbtSidebar`.
 *
 * @param item - Dbt sidebar item
 * @param manifestPath - Path to the project's `manifest.json`
 * @param catalogPath - Path to the project's `catalog.json`
 * @param config - Starlight dbt options
 * @param logger - Optional logger for informational messages
 * @returns SidebarItem for the dbt project
 */
async function genSidebarFromDir(
	item: Extract<DbtSidebarItem, { dbt: boolean }>,
	manifestPath: string,
	catalogPath: string,
	config: StarlightDbtOptions,
	logger?: AstroIntegrationLogger
): Promise<SidebarItem> {
	const service = await getOrInitDbtService(item.slug, {
		type: 'file',
		manifest: manifestPath,
		catalog: catalogPath,
	});

	/*
	 * Add this slug to the internal project list for the loader.
	 * We check if it already exists to prevent duplicates during re-runs.
	 */
	if (!config._projects.includes(item.slug)) {
		config._projects.push(item.slug);
	}

	const dbtProjectSlug = path.join(config.baseUrl, item.slug);
	const dbtProjectPath = path.join(config.baseDir, item.slug);
	const dbtProjectLabel = item.label || item.slug;

	logger?.info(
		`Generating sidebar for dbt project: ${dbtProjectLabel} ` +
			`(path: ${dbtProjectPath} -> slug: ${dbtProjectSlug}) `
	);
	return getDbtSidebar(service, dbtProjectSlug, dbtProjectLabel, item.attrs);
}

/**
 * Check whether a filesystem path exists.
 *
 * @param p - Filesystem path to check
 * @returns Promise resolving to `true` if the path exists, otherwise `false`
 */
async function exists(p: string) {
	try {
		await fs.access(p);
		return true;
	} catch {
		return false;
	}
}

/**
 * Recursively scan a directory for dbt projects and categories.
 *
 * - Directories containing a `manifest.json` are treated as dbt project
 *   leaves and converted into sidebar entries.
 * - Other directories are treated as categories and scanned recursively.
 * - Certain common build and package directories are ignored.
 *
 * @param fullPath - Absolute filesystem path to scan
 * @param relativeBase - Base path used to build project slugs
 * @param attrs - Html attributes defined in sidebar
 * @param config - Starlight dbt options (baseUrl/baseDir)
 * @param logger - Optional integration logger for warnings/errors
 * @param depth - Used to prevent excessive recursion depth
 * @returns Promise resolving to an array of SidebarItems sorted by label
 */
async function scanDbtDirectory(
	fullPath: string,
	relativeBase: string,
	attrs: LinkHTMLAttributes,
	config: StarlightDbtOptions,
	logger?: AstroIntegrationLogger,
	depth = 0,
	MAX_DEPTH = 10
): Promise<SidebarItem[]> {
	if (depth > MAX_DEPTH) {
		logger?.warn(`Max depth reached at ${fullPath}. Stopping scan.`);
		return [];
	}

	const entries = await fs.readdir(fullPath, { withFileTypes: true });
	const items: SidebarItem[] = [];

	for (const entry of entries) {
		// Skip hidden files and common ignore targets
		if (!entry.isDirectory() || entry.name.startsWith('.')) {
			continue;
		}

		const projectPath = path.join(fullPath, entry.name);
		const manifestPath = path.join(projectPath, 'manifest.json');
		const slug = path.join(relativeBase, entry.name).replace(/\\/g, '/');

		if (await exists(manifestPath)) {
			items.push(
				await genSidebarFromDir(
					{ slug, label: entry.name, attrs, dbt: true, translations: {} },
					manifestPath,
					path.join(projectPath, 'catalog.json'),
					config,
					logger
				)
			);
		} else {
			const subItems = await scanDbtDirectory(projectPath, slug, attrs, config, logger, depth + 1);
			if (subItems.length > 0) {
				items.push({ label: entry.name, items: subItems, collapsed: true });
			}
		}
	}

	return items.sort((a, b) => {
		const getLabel = (item: SidebarItem): string =>
			typeof item === 'string' ? item : 'label' in item && item.label ? String(item.label) : '';
		return getLabel(a).localeCompare(getLabel(b));
	});
}

/**
 * Resolve a user-defined sidebar configuration that may include
 * starlight groups, autogenerate directives, or dbt project links.
 *
 * - Manual groups are resolved recursively.
 * - `autogenerate` entries trigger a recursive filesystem scan for dbt projects.
 * - Items flagged with `dbt: true` are expanded into generated project sidebars
 *   when a `manifest.json` exists at the target location.
 *
 * @param items - User-provided sidebar items
 * @param config - Starlight dbt options
 * @param astroConfig - Astro configuration (used to resolve filesystem paths)
 * @param logger - Optional logger for warnings and errors
 * @returns Resolved SidebarItem array suitable for rendering
 */
export async function resolveDbtSidebar(
	items: DbtSidebarItem[],
	config: StarlightDbtOptions,
	astroConfig: AstroConfig,
	logger?: AstroIntegrationLogger
): Promise<SidebarItem[]> {
	return Promise.all(
		items.map(async (item): Promise<SidebarItem> => {
			if ('items' in item) {
				return {
					...item,
					items: await resolveDbtSidebar(item.items, config, astroConfig, logger),
				};
			}

			if ('autogenerate' in item && 'dbt' in item.autogenerate) {
				const directory = item.autogenerate.directory;
				const attrs = item.autogenerate.attrs;
				const fullPath = path.join(astroConfig.root.pathname, config.baseDir, directory);

				if (!(await exists(fullPath))) {
					throw new Error(
						`[starlight-dbt] The directory for autogenerate does not exist: "${fullPath}". ` +
							`Check the "directory" setting in your sidebar configuration.`
					);
				}

				const generatedItems = await scanDbtDirectory(fullPath, directory, attrs, config, logger);

				if (generatedItems.length === 0) {
					logger?.warn(`No dbt projects (manifest.json files) found recursively in: ${fullPath}`);
				}

				return {
					label: item.label,
					collapsed: item.collapsed,
					badge: item.badge,
					items: generatedItems,
				};
			}

			if ('dbt' in item && item.dbt === true) {
				const projectPath = path.join(astroConfig.root.pathname, config.baseDir, item.slug);
				const manifestPath = path.join(projectPath, 'manifest.json');

				if (await exists(manifestPath)) {
					return genSidebarFromDir(
						item,
						manifestPath,
						path.join(projectPath, 'catalog.json'),
						config,
						logger
					);
				} else {
					logger?.error(`Bad manifest path: ${manifestPath}`);
					const { dbt, ...rest } = item;
					return rest;
				}
			}

			return item;
		})
	);
}

/**
 * Parse a sidebar entry label to determine dbt root metadata.
 *
 * A dbt root label is prefixed with `dbtRootIdentifierPrefix` and follows
 * the format:
 *
 *   <prefix><projectSlug><_SEP><humanReadableLabel>
 *
 * @param label - Raw sidebar entry label
 * @returns Object containing:
 *   - `isRoot`: whether the label represents a dbt root
 *   - `projectSlug`: extracted project slug if root, otherwise empty
 *   - `cleanLabel`: human-readable label with dbt prefix removed if present
 */
function parseDbtRootLabel(label: string) {
	const isRoot = label.startsWith(dbtRootIdentifierPrefix);

	if (!isRoot) {
		return {
			isRoot: false,
			projectSlug: '',
			cleanLabel: label,
		};
	}

	const [projectSlug = '', cleanLabel = label] = label
		.replace(dbtRootIdentifierPrefix, '')
		.split(_SEP);

	return { isRoot: true, projectSlug, cleanLabel };
}

/**
 * Traverse a sidebar entry tree and collect all discovered dbt types.
 *
 * Looks for `data-dbt-type` attributes on link entries so callers can
 * target dbt sub-types via CSS.
 *
 * @param entry - Root sidebar entry to traverse
 * @returns Array of unique dbt types found in the branch
 */
function collectDbtTypes(entry: SidebarEntry): string[] {
	const types = new Set<string>();

	const visit = (e: SidebarEntry) => {
		if (e.type === 'link' && e.attrs?.['data-dbt-type']) {
			types.add(e.attrs['data-dbt-type']);
		} else if (e.type === 'group' && e.entries) {
			e.entries.forEach(visit);
		}
	};

	visit(entry);
	return Array.from(types);
}

/**
 * Extract metadata from a sidebar entry for dbt-specific handling.
 *
 * Determines whether the entry represents a dbt project root, extracts
 * any associated project metadata from the label, and collects dbt
 * sub-types present within the entry tree for styling or targeting.
 *
 * @param entry - Sidebar entry to inspect
 * @returns Object containing:
 *   - `isRoot`: whether the entry is a dbt root entry
 *   - `cleanLabel`: human-readable label with dbt prefix removed if present
 *   - `projectSlug`: project slug extracted from a dbt root label (or empty)
 *   - `types`: array of discovered `data-dbt-type` values within the branch
 */
export function getSidebarEntryMeta(entry: SidebarEntry) {
	const label = entry.label || '';
	const { isRoot, projectSlug, cleanLabel } = parseDbtRootLabel(label);
	const types = collectDbtTypes(entry);

	return { isRoot, cleanLabel, projectSlug, types };
}
