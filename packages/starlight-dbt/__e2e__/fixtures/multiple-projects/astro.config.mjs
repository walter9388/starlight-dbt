import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import dbtPlugin from 'starlight-dbt';

export default defineConfig({
	integrations: [
		starlight({
			title: 'Multiple Projects',
			pagefind: false,
			plugins: [
				dbtPlugin({
					sidebar: [
						{
							label: 'Examples',
							autogenerate: { directory: 'examples' },
						},
						{
							slug: 'project1',
							dbt: true,
						},
						{
							label: 'Project #2',
							autogenerate: {
								directory: 'project2',
								dbt: true,
							},
						},
					],
				}),
			],
		}),
	],
});
