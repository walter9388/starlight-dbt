import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { createDbtService } from './service/project';

import type { DbtService } from './service/types';
import type { JsonInput, DbtArtifacts, DbtSource } from './types';

// Memory Singleton to prevent double-processing during a single build
const SERVICE_CACHE = new Map<string, DbtService>();

export async function getOrInitDbtService(
	projectId: string,
	source: DbtSource
): Promise<DbtService> {
	// In-memory cache for loader to use after initial plugin load
	const cached = SERVICE_CACHE.get(projectId);
	if (cached) {
		return cached;
	}

	// create service
	const artifacts = await fetchArtifacts(source);
	const service = await createDbtService(artifacts);

	// cache and return
	SERVICE_CACHE.set(projectId, service);
	return service;
}

export async function fetchArtifacts(source: DbtSource): Promise<DbtArtifacts> {
	switch (source.type) {
		case 'file':
			return loadDbtArtifactFromFile(source);

		case 'http':
			// TODO: add fetch logic here, for example:
			// 		const [mReq, cReq] = await Promise.all([fetch(source.manifest), fetch(source.catalog)]);
			// 		return { manifest: await mReq.json(), catalog: await cReq.json() };
			throw new Error('Http source not yet implemented');

		case 's3':
			// TODO: Add AWS SDK logic here later
			throw new Error('S3 source not yet implemented');

		default:
			throw new Error('Unknown source type');
	}
}

async function loadDbtArtifactFromFile(
	source: Extract<DbtSource, { type: 'file' }>
): Promise<DbtArtifacts> {
	return {
		manifest: await loadJson(source.manifest, 'manifest'),
		catalog: await loadJson(source.catalog, 'catalog'),
	};
}

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
			throw new Error(`Failed to read ${label} file at "${filePath}": ${(err as Error).message}`);
		}

		try {
			return JSON.parse(contents) as Record<string, unknown>;
		} catch {
			throw new Error(`Invalid JSON in ${label} file at "${filePath}"`);
		}
	}

	throw new Error(`Invalid ${label}: must be a file path or JSON object`);
}
