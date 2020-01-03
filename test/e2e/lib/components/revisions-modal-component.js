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
		super( driver, By.css( '.editor-revisions' ) );
	}

	async _preInit() {
		return await this.driver.switchTo().defaultContent();
	}

	async loadFirstRevision() {
		await driverHelper.clickWhenClickable(
			this.driver,
			By.css( '.editor-revisions-list__revision:last-child .editor-revisions-list__button' )
		);

		await driverHelper.clickWhenClickable( this.driver, By.css( '[data-e2e-button="load"]' ) );

		return driverHelper.waitTillNotPresent( this.driver, this.expectedElementSelector );
	}
}
