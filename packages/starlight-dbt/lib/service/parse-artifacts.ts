import { catalog, manifest } from '@yu-iskw/dbt-artifacts-parser/dist/';

/**
 * Parses and validates a dbt manifest (v12 only).
 *
 * @param input - raw manifest JSON
 * @returns Parsed manifest v12 object
 * @throws If the manifest is not v12 or cannot be parsed
 */
export async function parseDbtManifest(input: Record<string, unknown>) {
	// const json = await loadJson(input, 'manifest');
	return manifest.parseManifestV12(input);
}

/**
 * Parses and validates a dbt catalog (v1 only).
 *
 * @param input - raw catalog JSON
 * @returns Parsed catalog v1 object
 * @throws If the catalog is not v1 or cannot be parsed
 */
export async function parseDbtCatalog(input: Record<string, unknown>) {
	// const json = await loadJson(input, 'catalog');
	return catalog.parseCatalogV1(input);
}
