import type { ManifestMetadata } from './types';

export function getQuoteChar(project_metadata: ManifestMetadata): string {
	const backtickDatabases = ['bigquery', 'spark', 'databricks'];
	const adapter_type = project_metadata?.adapter_type || '';
	return backtickDatabases.includes(adapter_type) ? '`' : '"';
}
