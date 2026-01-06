// adapted from https://github.com/dbt-labs/dbt-docs/blob/e03a7912f50d0ceb770fb77b99a059d57f810a9c/src/app/services/compat.js

import type { ManifestMetadata } from './types';

export function getQuoteChar(project_metadata: ManifestMetadata): string {
	const backtickDatabases = ['bigquery', 'spark', 'databricks'];
	const adapter_type = project_metadata?.adapter_type || '';
	return backtickDatabases.includes(adapter_type) ? '`' : '"';
}
