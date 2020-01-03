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

		// Using a JS click here since the Webdriver click wasn't working.
		const loadButton = await this.driver.findElement( By.css( '[data-e2e-button="load"]' ) );
		await this.driver.executeScript( 'arguments[0].click()', loadButton );

		return driverHelper.waitTillNotPresent( this.driver, this.expectedElementSelector );
	}
}
