// adapted from https://github.com/dbt-labs/dbt-docs/blob/e03a7912f50d0ceb770fb77b99a059d57f810a9c/src/app/services/project_service.js

import type { AugmentedMacro, AugmentedMacros } from './types';

/**
 * Consolidate adapter macros by grouping them and marking implementations per adapter.
 *
 * Adapter macros are those that call the `adapter_macro(...)` helper in their
 * `macro_sql`. This function will collect those adapter macros, attach the
 * source SQL under the `impls['Adapter Macro']` key and mark the macro with
 * `is_adapter_macro = true`.
 *
 * It will also locate adapter-specific implementations named like
 * `<adapter>__<macro_name>` (for example `postgres__my_macro`) and attach
 * those SQL bodies to the `impls` map under the adapter key.
 *
 * The returned array contains the consolidated top-level adapter macros first,
 * followed by the remaining macros that were not adapter-specific
 * implementations.
 *
 * @param macros - A collection of macros (ManifestMacros)
 * @param _adapter - Optional adapter name (unused, kept for compatibility)
 * @returns An array of macros with adapter implementations consolidated
 */
export function consolidateAdapterMacros(
	macros: AugmentedMacros,
	_adapter?: string | null
): AugmentedMacro[] {
	// Collect macros that define an adapter_macro
	const adapter_macros: AugmentedMacros = {};
	Object.values(macros).forEach((macro) => {
		if (/{{\s*adapter_macro\([^)]+\)\s+}}/.test(macro.macro_sql)) {
			macro.impls = { 'Adapter Macro': macro.macro_sql };
			macro.is_adapter_macro = true;
			adapter_macros[macro.name] = macro;
		}
	});

	// Known databases/adapters (TODO: extract to global constant)
	const databases = ['postgres', 'redshift', 'bigquery', 'snowflake', 'spark', 'presto', 'default'];

	// Process other macros that are adapter-specific implementations
	const extras = Object.values(macros).filter((macro) => {
		if (macro.name in adapter_macros) {
			return false; // already processed as an adapter_macro, exclude from extras
		}

		const parts = macro.name.split('__');
		const head = parts.shift();
		const macro_name = parts.join('__');

		if (head && databases.includes(head) && adapter_macros[macro_name]) {
			adapter_macros[macro_name].impls ??= {};
			adapter_macros[macro_name].impls[head] = macro.macro_sql;
			adapter_macros[macro_name].is_adapter_macro_impl = true;
			return false; // exclude this macro from extras
		}

		return true; // keep in extras
	});

	return Object.values(adapter_macros).concat(extras);
}

/**
 * Clean and consolidate project macros.
 *
 * - Groups macros by `package_name`.
 * - Filters out macros from the `dbt` package and (optionally) the
 *   `dbt_<adapter>` package (these are considered framework/internal macros).
 * - For each remaining package, consolidates adapter macros via
 *   `consolidateAdapterMacros` and returns a map keyed by `unique_id`.
 *
 * @param macros - All macros from the parsed manifest
 * @param adapter - Optional adapter name to filter `dbt_<adapter>` package
 * @returns A map of consolidated macros keyed by `unique_id`
 */
export function cleanProjectMacros(macros: AugmentedMacros, adapter?: string | null) {
	// Step 1: group macros by package_name
	const packageMacros: Record<string, AugmentedMacros> = {};

	Object.values(macros).forEach((macro) => {
		const pkg = macro.package_name;

		if (!packageMacros[pkg]) {
			packageMacros[pkg] = {};
		}

		packageMacros[pkg][macro.name] = macro;
	});

	// Step 2: consolidate + filter packages
	const consolidated: AugmentedMacro[] = [];

	Object.entries(packageMacros).forEach(([packageName, pkgMacros]) => {
		if (packageName === 'dbt' || (adapter && packageName === `dbt_${adapter}`)) {
			return;
		}

		const result = consolidateAdapterMacros(pkgMacros, adapter);
		consolidated.push(...result);
	});

	// Step 3: key by unique_id
	const result: AugmentedMacros = {};

	consolidated.forEach((macro) => {
		result[macro.unique_id] = macro;
	});

	return result;
}
