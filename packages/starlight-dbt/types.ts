// Public types API for starlight-dbt consumers

// Service types
export type { DbtService, TreeFile, TreeFolder, TreeItem, TreeNodeType } from './lib/service/types';

// Collection types (for Astro content layer consumers)
export type { DbtCollectionEntry, DbtCollectionNode } from './lib/schemas/collection';

// Generated manifest types (for typed access to individual node fields)
export type {
	ManifestV12,
	ManifestModelNode,
	ManifestSourceNode,
	ManifestMacroNode,
	ManifestExposureNode,
	ManifestMetricNode,
	ManifestSemanticModelNode,
	ManifestSavedQueryNode,
	ManifestUnitTestNode,
	ManifestColumnNode,
} from './lib/schemas/manifest';

// Generated catalog types
export type { DbtCatalog, DbtCatalogTable } from './lib/schemas/catalog';
