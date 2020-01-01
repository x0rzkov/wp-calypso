/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Gets the current ui locale slug
 * @param {object} state - global redux state
 * @return {String} current state value
 */
export default function getCurrentLocaleSlug( state ) {
	return get( state, 'ui.language.localeSlug', null );
}
