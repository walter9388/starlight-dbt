import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StarlightDbtOptions } from './config';
import type { HookParameters } from '@astrojs/starlight/types';
import type { AstroConfig } from 'astro';
import type { ProjectNode, TreeItem, MacroValues, dbtData } from 'starlight-dbt/types';
import { dbtRootIdentifierPrefix } from './constants';

export type StarlightUserConfig = HookParameters<'config:setup'>['config'];
type SidebarItem = NonNullable<StarlightUserConfig['sidebar']>[number];

export const getPageTemplatePath = (config: StarlightDbtOptions): string => {
	const dbtPageTemplateName = 'DbtPageTemplate.astro';

	// 1. Resolve the path to the plugin's internal template (relative to this file)
	const internalTemplate = fileURLToPath(
		new URL(`./components/${dbtPageTemplateName}`, import.meta.url)
	);

	// 2. Resolve the path to the user's potential override
	const userOverride = path.resolve(`./src/components/${dbtPageTemplateName}`);

	// 3. Determine which one to use
	const entrypoint = config.template
		? path.resolve(config.template) // User provided a specific path in config
		: fs.existsSync(userOverride)
			? userOverride // User placed a file in their components folder
			: internalTemplate; // Fallback to plugin default

	return entrypoint;
};

export const getDbtArtifactsAbsolutePath = (filepath: string, astroConfig: AstroConfig): string => {
	return path.resolve(fileURLToPath(astroConfig.root), filepath);
};

export const getDbtSidebar = (
	currentSidebar: SidebarItem[],
	service: dbtData,
	baseUrl: string,
	dbtProjectName: string
): SidebarItem[] => {
	const dbtDatabaseSidebar = extractNestedSidebar(service.tree.database, baseUrl, 'database');
	const dbtProjectSidebar = extractNestedSidebar(service.tree.project, baseUrl, 'project');
	const dbtGroupsSidebar = extractNestedSidebar(service.tree.groups, baseUrl, 'group');
	currentSidebar.push({
		label: dbtRootIdentifierPrefix + dbtProjectName,
		items: [...dbtDatabaseSidebar, ...dbtProjectSidebar, ...dbtGroupsSidebar],
		collapsed: true,
	});
	return currentSidebar;
};

function extractNestedSidebar(
	tree: TreeItem<ProjectNode | MacroValues>[],
	baseUrl: string,
	dbtTreeDataIdentifer: 'project' | 'database' | 'group'
): SidebarItem[] {
	// Normalize the base URL (ensure leading slash, remove trailing slash)
	const normalizedBase = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
	const cleanBase = normalizedBase.endsWith('/') ? normalizedBase.slice(0, -1) : normalizedBase;

	return tree.map((item) => {
		if ('items' in item) {
			return {
				label: item.name,
				items: extractNestedSidebar(item.items, baseUrl, dbtTreeDataIdentifer),
				collapsed: true,
			};
		}

		return {
			label: item.name,
			link: `${cleanBase}/${item.unique_id}`,
			attrs: {
				'data-dbt-type': dbtTreeDataIdentifer,
				class: 'dbt-item',
			},
		};
	});
}

// TODO: Improve typing here with Astro SidebarEntry type
interface _SidebarEntry {
	label?: string;
	type: string;
	attrs?: { [x: `data-${string}`]: any };
	entries?: _SidebarEntry[];
}
export function getSidebarEntryMeta(entry: _SidebarEntry) {
	const label = entry.label || '';
	const isRoot = label.startsWith(dbtRootIdentifierPrefix);
	const cleanLabel = isRoot ? label.replace(dbtRootIdentifierPrefix, '') : label;

	// Collect all dbt types within this branch for CSS targeting
	const types = new Set<string>();
	const collectTypes = (e: _SidebarEntry) => {
		if (e.type === 'link' && e.attrs?.['data-dbt-type']) {
			types.add(e.attrs['data-dbt-type']);
		} else if (e.type === 'group' && e.entries) {
			e.entries.forEach(collectTypes);
		}
	};
	collectTypes(entry);

	return { isRoot, cleanLabel, types: Array.from(types) };
}
