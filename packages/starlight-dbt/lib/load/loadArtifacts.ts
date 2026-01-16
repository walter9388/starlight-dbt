import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { catalog, manifest } from '@yu-iskw/dbt-artifacts-parser/dist/';

import type { JsonInput } from './types';

/**
 * Loads a JSON object from either:
 * - an already-parsed object
 * - a file path pointing to a JSON file
 *
 * @param input - File path or parsed JSON object
 * @param label - Human-readable label used in error messages
 * @returns Parsed JSON object
 * @throws If the input is invalid or the file cannot be read / parsed
 */
async function loadJson(input: JsonInput, label: string): Promise<Record<string, unknown>> {
	if (typeof input === 'object' && input !== null) {
		return input;
	}

	if (typeof input === 'string') {
		const filePath = path.resolve(input);

		let contents: string;
		try {
			contents = await readFile(filePath, 'utf8');
		} catch (err) {
			throw new Error(`Failed to read ${label} file at "${filePath}"`);
		}

		try {
			return JSON.parse(contents) as Record<string, unknown>;
		} catch {
			throw new Error(`Invalid JSON in ${label} file at "${filePath}"`);
		}
	}

	throw new Error(`Invalid ${label}: must be a file path or JSON object`);
}

/**
 * Loads and parses a dbt manifest (v12 only).
 *
 * @param input - File path or parsed manifest JSON
 * @returns Parsed manifest v12 object
 * @throws If the manifest is not v12 or cannot be parsed
 */
export async function loadManifestV12(input: JsonInput) {
	const json = await loadJson(input, 'manifest');
	return manifest.parseManifestV12(json);
}

/**
 * Loads and parses a dbt catalog (v1 only).
 *
 * @param input - File path or parsed catalog JSON
 * @returns Parsed catalog v1 object
 * @throws If the catalog is not v1 or cannot be parsed
 */
export async function loadCatalogV1(input: JsonInput) {
	const json = await loadJson(input, 'catalog');
	return catalog.parseCatalogV1(json);
}
