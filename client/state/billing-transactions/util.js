/**
 * External dependencies
 */

import { moment } from 'i18n-calypso';

/**
 * Parses the date within a transaction.
 * Returns a copy of the updated transaction.
 *
 * @param  {object}  transaction  Transaction object
 * @returns {object}               Updated transaction with date converted from string to a Date object.
 */
export const parseTransactionDate = transaction => {
	return { ...transaction, date: moment( transaction.date ).toDate() };
};
