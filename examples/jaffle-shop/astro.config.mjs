// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import dbtPlugin from 'starlight-dbt';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'My Docs',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			sidebar: [
				{
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
						{ label: 'Example Guide', slug: 'guides/example' },
					],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
			plugins: [
				dbtPlugin({
					// sidebar: [
					// 	{
					// 		label: 'Projects',
					// 		autogenerate: { directory: 'reference' },
					// 		items: [{ label: 'Project A', slug: 'projects/project_a' }],
					// 	},
					// 	{
					// 		label: 'Project B',
					// 		slug: 'dev/project_b',
					// 	},
					// ],

					manifest: 'src/content/dbt/jaffle_shop/manifest.json',
					catalog: 'src/content/dbt/jaffle_shop/catalog.json',
					project: 'jaffle_shop',
				}),
			],
		}),
	],
});
