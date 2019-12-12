/**
 * External dependencies
 */
import { By as by } from 'selenium-webdriver';
import URL from 'url';

/**
 * Internal dependencies
 */
import AsyncBaseContainer from '../async-base-container';
import * as driverHelper from '../driver-helper.js';
import * as dataHelper from '../data-helper';

export default class ReaderPage extends AsyncBaseContainer {
	constructor( driver, url ) {
		if ( ! url ) {
			url = ReaderPage.getReaderURL();
		}
		super( driver, by.css( '.is-section-reader' ), url );
	}

	async siteOfLatestPost() {
		const href = await this.driver
			.findElement( by.css( '.reader-visit-link' ) )
			.getAttribute( 'href' );
		return URL.parse( href ).host;
	}

	async shareLatestPost() {
		const shareButtonSelector = by.css( '.reader-share__button' );
		const hasSharablePost = await driverHelper.isElementPresent( this.driver, shareButtonSelector );

		if ( ! hasSharablePost ) {
			await this.addSiteToFollow();
		}

		await driverHelper.clickWhenClickable( this.driver, shareButtonSelector );
		return await driverHelper.clickWhenClickable(
			this.driver,
			by.css( '.reader-popover .site__content' )
		);
	}

	async addSiteToFollow() {
		// If user doesn't follow any site add first site from the suggested ones
		await driverHelper.clickWhenClickable(
			this.driver,
			by.css( '.empty-content__action.button.is-primary' )
		);
		await driverHelper.clickWhenClickable( this.driver, by.css( '.follow-button__label' ) );
		await driverHelper.verifyTextPresent(
			this.driver,
			by.css( '.follow-button__label' ),
			'Following'
		);

		return await driverHelper.clickWhenClickable(
			this.driver,
			by.css( '.menu-link-text[data-e2e-sidebar="Followed Sites"]' )
		);
	}

	async commentOnLatestPost( comment ) {
		await driverHelper.clickWhenClickable( this.driver, by.css( '.comment-button' ) );
		await driverHelper.setWhenSettable(
			this.driver,
			by.css( '.comments__form textarea' ),
			comment
		);
		return await driverHelper.clickWhenClickable( this.driver, by.css( '.comments__form button' ) );
	}

	async waitForCommentToAppear( comment ) {
		const commentSelector = by.css( '.comments__comment-content' );
		return await driverHelper.verifyTextPresent( this.driver, commentSelector, comment );
	}

	static getReaderURL() {
		return dataHelper.getCalypsoURL( 'read' );
	}
}
