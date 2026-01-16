import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import dbtPlugin from 'starlight-dbt';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Basics',
			pagefind: false,
			sidebar: [
				{
					label: 'Examples',
					autogenerate: { directory: 'examples' },
				},
			],
			// plugins: [dbtPlugin()],
		}),
	],
});
