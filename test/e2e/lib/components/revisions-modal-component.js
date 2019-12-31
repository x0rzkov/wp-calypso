/**
 * External dependencies
 */
import { By } from 'selenium-webdriver';

/**
 * Internal dependencies
 */
import * as driverHelper from '../driver-helper';
import AsyncBaseContainer from '../async-base-container';

export default class RevisionsModalComponent extends AsyncBaseContainer {
	constructor( driver ) {
		super( driver, By.css( '.editor-revisions__dialog' ) );
	}

	async loadFirstRevision() {
		await driverHelper.clickWhenClickable(
			this.driver,
			By.css( '.editor-revisions-list__revision:last-child .editor-revisions-list__button' )
		);

		return await driverHelper.clickWhenClickable(
			this.driver,
			By.css( '[data-e2e-button="load"]' )
		);
	}
}
