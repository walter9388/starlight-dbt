// adapted from https://github.com/dbt-labs/dbt-docs/blob/e03a7912f50d0ceb770fb77b99a059d57f810a9c/src/app/services/project_service.js

import { populateNodeMap } from './build-node-trees';
import { buildProject, populateModelTree } from './build-project';
import { parseDbtManifest, parseDbtCatalog } from './parse-artifacts';

import type {
	AugmentedCatalogArtifact,
	AugmentedManifestArtifact,
	CatalogArtifact,
	DbtArtifacts,
	ManifestArtifact,
	DbtService,
} from './types';

/**
 * DbtServiceImpl is responsible for loading, parsing, and organising
 * dbt manifest and catalog artifacts into a structured, queryable form.
 *
 * The lifecycle of this service is:
 * 1. `init()`   – Load and parse raw JSON artifacts
 * 2. `build()`  – Build project structures and trees
 * 3. `populate_node_map()` – Create a lookup map of nodes by `unique_id`
 */
export class DbtServiceImpl implements DbtService {
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
	node_map = {};

	/** Raw artifact files as loaded from disk / input */
	files = {
		manifest: {} as ManifestArtifact,
		catalog: {} as CatalogArtifact,
	};

	/** Indicates whether artifacts have been successfully loaded */
	loaded = false;

	constructor(
		private readonly manifestInput: Record<string, unknown>,
		private readonly catalogInput: Record<string, unknown>
	) {}

	/**
	 * Loads the dbt manifest and catalog artifacts from the provided inputs.
	 *
	 * This must be called before `build()` or `populate_node_map()`.
	 */
	async init(): Promise<void> {
		this.files.manifest = await parseDbtManifest(this.manifestInput);
		this.files.catalog = await parseDbtCatalog(this.catalogInput);
		this.loaded = true;
	}

	/**
	 * Parses the loaded manifest and catalog artifacts into the
	 * internal project representation and tree structures.
	 *
	 * Assumes `init()` has already been called.
	 */
	build(): void {
		buildProject(this);
		populateModelTree(this);
	}

	/**
	 * Creates a flat lookup map of all nodes in the project, keyed by `unique_id`.
	 *
	 * This enables fast access to any node without traversing the trees.
	 * The map is rebuilt from scratch each time this method is called
	 * to avoid stale references.
	 */
	populate_node_map(): void {
		// Reset the map to ensure we don't have stale data
		this.node_map = {};

		// Iterate through every branch in the tree and fold it into the map
		Object.values(this.tree).forEach((branch) => {
			populateNodeMap(branch, this.node_map);
		});
	}
}

/**
 * Convenience factory that creates, initialises, and fully prepares
 * a DbtServiceImpl from the given dbt artifacts.
 */
export async function createDbtService(artifacts: DbtArtifacts): Promise<DbtService> {
	const service = new DbtServiceImpl(artifacts.manifest, artifacts.catalog);

	await service.init();
	service.build();
	service.populate_node_map();

	return service;
}
