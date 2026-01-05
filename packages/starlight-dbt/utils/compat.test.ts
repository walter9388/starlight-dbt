import { getQuoteChar } from './compat';
import { expect, test } from 'vitest';

const BACKTICK = '`';
const QUOTE = '"';

test('column quoting', () => {
	expect(getQuoteChar({ adapter_type: 'bigquery' })).toStrictEqual(BACKTICK);
	expect(getQuoteChar({ adapter_type: 'spark' })).toStrictEqual(BACKTICK);
	expect(getQuoteChar({ adapter_type: 'databricks' })).toStrictEqual(BACKTICK);
	expect(getQuoteChar({ adapter_type: 'postgres' })).toStrictEqual(QUOTE);
	expect(getQuoteChar({ adapter_type: 'snowflake' })).toStrictEqual(QUOTE);
	expect(getQuoteChar({ adapter_type: 'redshift' })).toStrictEqual(QUOTE);
	expect(getQuoteChar({ adapter_type: 'unknown_db' })).toStrictEqual(QUOTE);
});

test('column quoting with invalid adapter', () => {
	expect(getQuoteChar({ adapter_type: null })).toStrictEqual(QUOTE);
	expect(getQuoteChar({})).toStrictEqual(QUOTE);
	expect(getQuoteChar(null)).toStrictEqual(QUOTE);
});
