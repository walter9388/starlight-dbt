// adapted from https://github.com/dbt-labs/dbt-docs/blob/e03a7912f50d0ceb770fb77b99a059d57f810a9c/src/app/services/project_service.js
import { loadProject, populateModelTree } from './load/loadProject';

import type {
	AugmentedCatalogArtifact,
	AugmentedManifestArtifact,
	CatalogArtifact,
	JsonInput,
	ManifestArtifact,
	ProjectService,
} from './load/types';

export function createProjectService(manifestInput: JsonInput, catalogInput: JsonInput) {
	const service: ProjectService = {
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
		},
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
	};

	return service;
}
