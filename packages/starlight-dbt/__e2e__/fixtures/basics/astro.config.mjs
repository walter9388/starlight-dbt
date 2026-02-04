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
					autogenerate: {
						directory: 'examples',
						attrs: { style: 'font-style: italic; background-color: orange' },
					},
					badge: 'new',
				},
			],
			plugins: [
				dbtPlugin({
					sidebar: [
						{
							label: 'Default dbt Project',
							slug: 'default',
							dbt: true,
						},
						{
							label: 'Examples',
							autogenerate: {
								directory: 'examples',
								attrs: { style: 'font-style: italic; background-color: orange' },
							},
							badge: 'new',
						},
					],
				}),
			],
		}),
	],
});
