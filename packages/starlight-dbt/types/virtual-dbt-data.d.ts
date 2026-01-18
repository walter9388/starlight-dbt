declare module 'virtual:dbt-data' {
	import type { dbtData } from '../lib/load/types';
	export const dbtData: dbtData;
}
