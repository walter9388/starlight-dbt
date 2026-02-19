import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { dbtLoader, dbtCollectionSchema } from 'starlight-dbt/loaders';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	dbt: defineCollection({ loader: dbtLoader(), schema: dbtCollectionSchema }),
};
