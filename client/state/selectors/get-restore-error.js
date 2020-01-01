/**
 * External dependencies
 */

import { get } from 'lodash';

/**
 * Returns the error for a restore request
 *
 * @param {object} state Global state tree
 * @param {number|String} siteId the site ID
 * @return {?object} Error object, null if no data
 */
export default function getRestoreError( state, siteId ) {
	return get( state, [ 'activityLog', 'restoreError', siteId ], null );
}
