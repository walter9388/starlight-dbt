import { z } from 'astro/zod';

export const StarlightDbtOptionsSchema = z
	.object({
		manifest: z.string().default('src/content/dbt/manifest.json'),
		catalog: z.string().default('src/content/dbt/catalog.json'),
		template: z.string().optional(),
		basePath: z.string().default('dbt'),
	})
	.default({});

export type StarlightDbtUserOptions = z.input<typeof StarlightDbtOptionsSchema>;
export type StarlightDbtOptions = z.output<typeof StarlightDbtOptionsSchema>;
