import { parsedManifestV12Schema } from '../schemas/manifest';
import { parsedCatalogV1Schema } from '../schemas/catalog';

import type { ManifestArtifact } from './types';
import type { CatalogArtifact } from './types';

/**
 * Parses and validates a dbt manifest (v12 only).
 *
 * @param input - Raw manifest JSON
 * @returns Parsed manifest v12 object cast to the internal ManifestArtifact type
 * @throws If the manifest is not v12 or cannot be parsed
 */
export function parseDbtManifest(input: Record<string, unknown>): ManifestArtifact {
	return parsedManifestV12Schema.parse(input) as unknown as ManifestArtifact;
}

/**
 * Parses and validates a dbt catalog (v1 only).
 *
 * @param input - Raw catalog JSON
 * @returns Parsed catalog v1 object cast to the internal CatalogArtifact type
 * @throws If the catalog is not v1 or cannot be parsed
 */
export function parseDbtCatalog(input: Record<string, unknown>): CatalogArtifact {
	return parsedCatalogV1Schema.parse(input) as unknown as CatalogArtifact;
}
