// adapted from https://github.com/dbt-labs/dbt-docs/blob/e03a7912f50d0ceb770fb77b99a059d57f810a9c/src/app/services/project_service.js

import merge from 'deepmerge';

import type { CatalogArtifact, ManifestArtifact } from './types';

/**
 * Match the keys of an object to a set of destination keys ignoring case.
 *
 * This will return a new object where each original key is replaced by the
 * matching key from `dest_keys` (matched case-insensitively). If no match is
 * found, the original key is preserved.
 *
 * @param dest_keys - Array of desired keys to map to (case preserved)
 * @param obj - Source object whose keys should be matched
 * @returns A new object with keys mapped to the matching keys from `dest_keys`
 */
export function match_dict_keys(dest_keys: string[], obj: any) {
	const new_obj: any = {};

	Object.entries(obj).forEach(([key, value]) => {
		const desired_key = dest_keys.find((k) => k.toLowerCase() === key.toLowerCase());
		new_obj[desired_key || key] = value;
	});

	return new_obj;
}

/**
 * Incorporate catalog information into a manifest.
 *
 * - Copies `sources` into `nodes` on the catalog so both manifests and
 *   catalogs can be merged consistently.
 * - For each node in the manifest that also exists in the catalog, re-map the
 *   node's column keys to match the column names from the catalog using
 *   `match_dict_keys` (case-insensitive mapping).
 * - Returns the merged result of `catalog` and `manifest` where later keys
 *   from the manifest will override catalog entries where appropriate.
 *
 * @param manifest - Parsed manifest artifact (v12)
 * @param catalog - Parsed catalog artifact (v1)
 * @returns The merged project object combining catalog and manifest
 */
export function incorporate_catalog(manifest: ManifestArtifact, catalog: CatalogArtifact) {
	// Re-combine sources and nodes
	Object.entries(catalog.sources).forEach(([source_id, source]) => {
		catalog.nodes[source_id] = source;
	});

	// later elements are preferred in the merge, but it
	// shouldn't matter, as these two don't clobber each other
	Object.entries(manifest.nodes).forEach(([node_id, node]) => {
		const catalog_entry = catalog.nodes[node_id];
		if (!catalog_entry) return;

		const catalog_column_names = Object.keys(catalog_entry.columns);
		node.columns = match_dict_keys(catalog_column_names, node.columns);
	});

	return merge(catalog, manifest);
}
