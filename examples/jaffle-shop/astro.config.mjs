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
				// {
				// 	label: 'Guides',
				// 	items: [
				// 		// Each item here is one entry in the navigation menu.
				// 		{ label: 'Example Guide', slug: 'guides/example' },
				// 	],
				// },
				// { label: 'Example Guide', slug: 'guides/example' },
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
			plugins: [
				dbtPlugin({
					sidebar: [
						{
							label: 'Guides',
							items: [
								// A markdown page under Guides at src/content/docs/guides/example.md
								{ label: 'Example Guide', slug: 'guides/example' },
								// A dbt project under Guides at src/content/dbt/jaffle_shop/{manifest.json,catalog.json}
								// A markdown page under Guides at src/content/dbt/guides/example.md
								// { label: 'Dbt Project Guide', slug: 'guides/example', dbt: true, markdown: true },
								{ label: 'Jaffle Shop (dbt)', slug: 'jaffle_shop', dbt: true },
							],
						},
						{
							label: 'Reference',
							// autogenerate: { directory: 'reference' }, // Autogenerate from src/content/dbt/reference (both markdown and dbt)
							autogenerate: { directory: '', dbt: true }, // Autogenerate from src/content/dbt/reference (both markdown and dbt)
						},
					],
				}),
			],
		}),
	],
});
