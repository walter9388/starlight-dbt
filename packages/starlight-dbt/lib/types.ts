/**
 * Input accepted by artifact loaders.
 *
 * - A parsed JSON object
 * - A file path pointing to a JSON file
 */
export type JsonInput = string | Record<string, unknown>;

export interface DbtArtifacts {
	manifest: Record<string, unknown>;
	catalog: Record<string, unknown>;
}

export type DbtSource =
	| { type: 'file'; manifest: string; catalog: string }
	| { type: 'http'; manifest: string; catalog: string }
	| { type: 's3'; bucket: string; region: string; manifestKey: string; catalogKey: string };
