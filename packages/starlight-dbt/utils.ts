import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StarlightDbtOptions } from './config';
import type { AstroConfig } from 'astro';

export const getPageTemplatePath = (config: StarlightDbtOptions): string => {
	const dbtPageTemplateName = 'dbtPageTemplate.astro';

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

export const getDbtArtifactsPath = (filepath: string, astroConfig: AstroConfig): string => {
	return path.resolve(fileURLToPath(astroConfig.root), filepath);
};
