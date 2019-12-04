/**
 * Internal dependencies
 */
import { hasEcommercePlan } from 'lib/cart-values/cart-items';
import isEligibleForDotcomChecklist from './is-eligible-for-dotcom-checklist';
import { retrieveSignupDestination } from 'signup/utils';

/**
 * @param {object} state Global state tree
 * @param {number} siteId Site ID
 * @param {object} cart object
 * @returns {boolean} True if current user is able to see the checklist after checkout
 */
export default function isEligibleForSignupDestination( state, siteId, cart ) {
	if ( hasEcommercePlan( cart ) ) {
		return false;
	}

	const destination = retrieveSignupDestination();

	if ( ! destination ) {
		return false;
	}

	if ( destination.includes( '/checklist/' ) ) {
		return isEligibleForDotcomChecklist( state, siteId );
	}

	return true;
}
