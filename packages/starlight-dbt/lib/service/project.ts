// adapted from https://github.com/dbt-labs/dbt-docs/blob/e03a7912f50d0ceb770fb77b99a059d57f810a9c/src/app/services/project_service.js

import { createNodeMap } from './build-node-trees';
import { loadManifestV12, loadCatalogV1 } from './validate-artifacts';
import { loadProject, populateModelTree } from './build-project';

import type {
	AugmentedCatalogArtifact,
	AugmentedManifestArtifact,
	CatalogArtifact,
	DbtArtifacts,
	JsonInput,
	ManifestArtifact,
	dbtData,
} from './types';

/**
 * DbtProjectService is responsible for loading, parsing, and organising
 * dbt manifest and catalog artifacts into a structured, queryable form.
 *
 * The lifecycle of this service is:
 * 1. `init()`   – Load and parse raw JSON artifacts
 * 2. `parse()`  – Build project structures and trees
 * 3. `create_id_map()` – Create a lookup map of nodes by `unique_id`
 */
export class DbtProjectService implements dbtData {
	/** Combined, augmented project representation */
	project = {} as AugmentedManifestArtifact & AugmentedCatalogArtifact;

	/** Hierarchical trees derived from the project artifacts */
	tree = {
		project: [],
		database: [],
		groups: [],
		sources: [],
		exposures: [],
		metrics: [],
		semantic_models: [],
		saved_queries: [],
		unit_tests: [],
	};

	/** Flat map of all nodes keyed by `unique_id` */
	id_map = {};

	/** Raw artifact files as loaded from disk / input */
	files = {
		manifest: {} as ManifestArtifact,
		catalog: {} as CatalogArtifact,
	};

	/** Indicates whether artifacts have been successfully loaded */
	loaded = false;

	constructor(
		private readonly manifestInput: JsonInput,
		private readonly catalogInput: JsonInput
	) {}

	/**
	 * Loads the dbt manifest and catalog artifacts from the provided inputs.
	 *
	 * This must be called before `parse()` or `create_id_map()`.
	 */
	async init(): Promise<void> {
		this.files.manifest = await loadManifestV12(this.manifestInput);
		this.files.catalog = await loadCatalogV1(this.catalogInput);
		this.loaded = true;
	}

	/**
	 * Parses the loaded manifest and catalog artifacts into the
	 * internal project representation and tree structures.
	 *
	 * Assumes `init()` has already been called.
	 */
	parse(): void {
		loadProject(this);
		populateModelTree(this);
	}

	/**
	 * Creates a flat lookup map of all nodes in the project, keyed by `unique_id`.
	 *
	 * This enables fast access to any node without traversing the trees.
	 * The map is rebuilt from scratch each time this method is called
	 * to avoid stale references.
	 */
	create_id_map(): void {
		// Reset the map to ensure we don't have stale data
		this.id_map = {};

		// Iterate through every branch in the tree and fold it into the map
		Object.values(this.tree).forEach((branch) => {
			createNodeMap(branch, this.id_map);
		});
	}
}

/**
 * Convenience factory that creates, initialises, and fully prepares
 * a DbtProjectService from the given dbt artifacts.
 */
export async function createDbtProjectService(artifacts: DbtArtifacts): Promise<dbtData> {
	const service = new DbtProjectService(artifacts.manifest, artifacts.catalog);

	await service.init();
	service.parse();
	service.create_id_map();

	return service;
}
