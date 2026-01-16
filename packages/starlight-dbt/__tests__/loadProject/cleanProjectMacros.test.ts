import { describe, it, expect } from 'vitest';

import { consolidateAdapterMacros, cleanProjectMacros } from '../../lib/load/cleanProjectMacros';

describe('consolidateAdapterMacros', () => {
	it('groups adapter implementations under the base adapter macro', () => {
		const macros: any = {
			my_macro: {
				name: 'my_macro',
				unique_id: 'macro.pkg.my_macro',
				macro_sql: "{{ adapter_macro('something') }} ",
				package_name: 'pkg',
			},
			postgres__my_macro: {
				name: 'postgres__my_macro',
				unique_id: 'macro.pkg.postgres__my_macro',
				macro_sql: 'SELECT 1',
				package_name: 'pkg',
			},
			snowflake__my_macro: {
				name: 'snowflake__my_macro',
				unique_id: 'macro.pkg.snowflake__my_macro',
				macro_sql: 'SELECT 1',
				package_name: 'pkg',
			},
			my_macro_not_impls: {
				name: 'my_macro_not_impls',
				unique_id: 'macro.pkg.my_macro_not_impls',
				macro_sql: "{{ adapter_macro('something') }} ",
				package_name: 'pkg',
			},
			other_macro: {
				name: 'other_macro',
				unique_id: 'macro.pkg.other_macro',
				macro_sql: 'SELECT 2',
				package_name: 'pkg',
			},
		};

		const result = consolidateAdapterMacros(macros);
		expect(result.length).toBe(3); // my_macro, my_macro_not_impls, other_macro

		// Check my_macro
		const my_macro = result.find((m) => m.name === 'my_macro');
		expect(my_macro).toBeDefined();
		expect(!!my_macro!.is_adapter_macro).toBe(true);
		expect(!!my_macro!.is_adapter_macro_impl).toBe(true);
		expect(my_macro!.impls).toBeDefined();
		expect(my_macro!.impls!['Adapter Macro']).toBe(macros.my_macro.macro_sql);
		expect(my_macro!.impls!['postgres']).toBe(macros['postgres__my_macro'].macro_sql);
		expect(my_macro!.impls!['snowflake']).toBe(macros['snowflake__my_macro'].macro_sql);

		// adapter-specific implementation should not appear as a separate top-level
		// macro in the consolidated array
		const postgresPresent = result.some((m) => m.name === 'postgres__my_macro');
		expect(postgresPresent).toBe(false);

		// Check my_macro_not_impls
		const my_macro_not_impls = result.find((m) => m.name === 'my_macro_not_impls');
		expect(my_macro_not_impls).toBeDefined();
		expect(!!my_macro_not_impls!.is_adapter_macro).toBe(true);
		expect(!!my_macro_not_impls!.is_adapter_macro_impl).toBe(false);
		expect(my_macro_not_impls!.impls).toBeDefined();
		expect(my_macro_not_impls!.impls!['Adapter Macro']).toBe(macros.my_macro_not_impls.macro_sql);

		// Check other_macro
		const other_macro = result.find((m) => m.name === 'other_macro');
		expect(other_macro).toBeDefined();
		expect(!!other_macro!.is_adapter_macro).toBe(false);
		expect(!!other_macro!.is_adapter_macro_impl).toBe(false);
	});
});

describe('cleanProjectMacros', () => {
	it('groups, filters, consolidates macros and keys by unique_id', () => {
		const macros: any = {
			my_macro: {
				name: 'my_macro',
				unique_id: 'macro.pkg.my_macro',
				macro_sql: "{{ adapter_macro('something') }} ",
				package_name: 'pkg',
			},
			postgres__my_macro: {
				name: 'postgres__my_macro',
				unique_id: 'macro.pkg.postgres__my_macro',
				macro_sql: 'SELECT 1',
				package_name: 'pkg',
			},
			other_macro: {
				name: 'other_macro',
				unique_id: 'macro.otherpkg.other_macro',
				macro_sql: 'SELECT 2',
				package_name: 'otherpkg',
			},
			dbt_only: {
				name: 'dbt_only',
				unique_id: 'macro.dbt.dbt_only',
				macro_sql: 'SELECT 3',
				package_name: 'dbt',
			},
			dbtpg_macro: {
				name: 'dbtpg_macro',
				unique_id: 'macro.dbt_postgres.dbtpg_macro',
				macro_sql: 'SELECT 4',
				package_name: 'dbt_postgres',
			},
		};

		const result = cleanProjectMacros(macros, 'postgres');

		// Keys should be unique_id based and include pkg/otherpkg but not dbt packages
		expect(Object.keys(result)).toEqual(
			expect.arrayContaining(['macro.pkg.my_macro', 'macro.otherpkg.other_macro'])
		);
		expect(result['macro.dbt.dbt_only']).toBeUndefined();
		expect(result['macro.dbt_postgres.dbtpg_macro']).toBeUndefined();

		// Check consolidation for adapter macro
		const consolidated = result['macro.pkg.my_macro'];
		expect(consolidated).toBeDefined();
		expect(!!consolidated!.is_adapter_macro).toBe(true);
		expect(consolidated!.impls).toBeDefined();
		expect(consolidated!.impls!['Adapter Macro']).toBe(macros.my_macro.macro_sql);
		expect(consolidated!.impls!['postgres']).toBe(macros.postgres__my_macro.macro_sql);
	});
});
