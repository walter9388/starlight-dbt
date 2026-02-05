import type { StarlightRouteData } from '@astrojs/starlight/route-data';
import type { HookParameters } from '@astrojs/starlight/types';

type StarlightUserConfig = HookParameters<'config:setup'>['config'];
export type SidebarItem = NonNullable<StarlightUserConfig['sidebar']>[number];

type Sidebar = StarlightRouteData['sidebar'];
export type SidebarEntry = Sidebar[number];
export type SidebarLink = Extract<SidebarEntry, { type: 'link' }>;
export type SidebarGroup = Extract<SidebarEntry, { type: 'group' }>;

/**
 * Input accepted by artifact loaders.
 *
 * - A parsed JSON object
 * - A file path pointing to a JSON file
 */
export type JsonInput = string | Record<string, unknown>;

export interface DbtArtifacts {
	manifest: Record<string, unknown>;
	catalog: Record<string, unknown>;
}

export type DbtSource =
	| { type: 'file'; manifest: string; catalog: string }
	| { type: 'http'; manifest: string; catalog: string }
	| { type: 's3'; bucket: string; region: string; manifestKey: string; catalogKey: string };
