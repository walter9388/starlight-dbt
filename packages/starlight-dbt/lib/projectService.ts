// adapted from https://github.com/dbt-labs/dbt-docs/blob/e03a7912f50d0ceb770fb77b99a059d57f810a9c/src/app/services/project_service.js
import { createNodeMap } from './load/buildNodeTrees';
import { loadProject, populateModelTree } from './load/loadProject';

import type {
	AugmentedCatalogArtifact,
	AugmentedManifestArtifact,
	CatalogArtifact,
	JsonInput,
	ManifestArtifact,
	dbtData,
} from 'starlight-dbt/types';

export function createProjectService(manifestInput: JsonInput, catalogInput: JsonInput) {
	const service: dbtData = {
		project: {} as AugmentedManifestArtifact & AugmentedCatalogArtifact,
		tree: {
			project: [],
			database: [],
			groups: [],
			sources: [],
			exposures: [],
			metrics: [],
			semantic_models: [],
			saved_queries: [],
			unit_tests: [],
		},
		id_map: {},
		files: {
			manifest: {} as ManifestArtifact,
			catalog: {} as CatalogArtifact,
		},
		loaded: false,

		/**
		 * Loads the project from manifest/catalog and populates the trees.
		 */
		init: async function () {
			await loadProject(this, manifestInput, catalogInput);
			populateModelTree(this);
			this.loaded = true;
		},

		/**
		 * Create a map of all nodes for quick lookup via their unique_id
		 */
		create_id_map: function () {
			// Reset the map to ensure we don't have stale data
			this.id_map = {};

			// Iterate through every branch in the tree and fold it into the map
			Object.values(this.tree).forEach((branch) => {
				createNodeMap(branch, this.id_map);
			});
		},
	};

	return service;
}
