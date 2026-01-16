import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	// default starlight docs collection
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
};
