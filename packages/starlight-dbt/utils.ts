import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { dbtRootIdentifierPrefix } from './constants';

import type { StarlightDbtOptions } from './config';
import type { AstroConfig } from 'astro';

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