import { z } from 'astro/zod';

import {
	SidebarLinkItemSchema,
	AutoSidebarGroupSchema,
	InternalSidebarLinkItemSchema,
	SidebarGroupSchema,
} from './starlight-internals/schemas/sidebar';

// Specifically for individual project roots
const DbtLinkItemSchema = InternalSidebarLinkItemSchema.extend({
	/** Flag to indicate this slug points to a dbt project in the dbt content collection. */
	dbt: z.literal(true),
});

const DbtAutoGroupSchema = AutoSidebarGroupSchema.extend({
	autogenerate: AutoSidebarGroupSchema.shape.autogenerate.extend({
		/** Flag to scan the dbt directory instead of the docs directory. */
		dbt: z.literal(true),
	}),
});

export type DbtSidebarItem =
	| z.output<typeof DbtLinkItemSchema>
	| z.output<typeof DbtAutoGroupSchema>
	| z.output<typeof SidebarLinkItemSchema>
	| z.output<typeof InternalSidebarLinkItemSchema>
	| z.output<typeof AutoSidebarGroupSchema>
	| DbtManualGroupOutput;

export type DbtManualGroupOutput = z.output<typeof SidebarGroupSchema> & {
	items: DbtSidebarItem[];
};

export type DbtManualGroupInput = z.input<typeof SidebarGroupSchema> & {
	items: Array<
		| z.input<typeof DbtLinkItemSchema>
		| z.input<typeof DbtAutoGroupSchema>
		| z.input<typeof SidebarLinkItemSchema>
		| z.input<typeof InternalSidebarLinkItemSchema>
		| z.input<typeof AutoSidebarGroupSchema>
		| DbtManualGroupInput
	>;
};

const DbtManualGroupSchema: z.ZodType<DbtManualGroupOutput, z.ZodTypeDef, DbtManualGroupInput> =
	SidebarGroupSchema.extend({
		items: z.lazy(() =>
			z
				.union([
					DbtLinkItemSchema,
					DbtAutoGroupSchema,
					SidebarLinkItemSchema,
					InternalSidebarLinkItemSchema,
					AutoSidebarGroupSchema,
					DbtManualGroupSchema,
				])
				.array()
		),
	});

const DbtSidebarItemSchema = z.union([
	DbtLinkItemSchema,
	DbtAutoGroupSchema,
	SidebarLinkItemSchema,
	InternalSidebarLinkItemSchema,
	AutoSidebarGroupSchema,
	DbtManualGroupSchema,
]);

export const StarlightDbtOptionsSchema = z.object({
	/** Directory for dbt artifacts (default: 'src/content/dbt') */
	baseDir: z.string().default('src/content/dbt'),
	/** Base URL path for dbt docs (default: 'dbt') */
	baseUrl: z.string().default('dbt'),
	/** The sidebar configuration with dbt support. */
	sidebar: DbtSidebarItemSchema.array().default([]),
	/** Path to a custom template for dbt pages */
	template: z.string().optional(),
});

export type StarlightDbtUserOptions = z.input<typeof StarlightDbtOptionsSchema>;
export type StarlightDbtOptions = z.output<typeof StarlightDbtOptionsSchema>;
