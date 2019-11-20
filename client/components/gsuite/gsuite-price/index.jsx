/**
 * External dependencies
 */
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslate } from 'i18n-calypso';
import { getCurrencyObject } from '@automattic/format-currency';

/**
 * Internal dependencies
 */
import { formatPrice, getAnnualPrice, getMonthlyPrice } from 'lib/gsuite';

/**
 * Style dependencies
 */
import './style.scss';

const GSuitePrice = ( { cost, currencyCode, showMonthlyPrice } ) => {
	const translate = useTranslate();

	const annualPrice = cost && currencyCode ? getAnnualPrice( cost, currencyCode ) : '-';
	const discountedPrice = cost && currencyCode ? getAnnualPrice( Math.ceil(cost - cost * 2 / 12), currencyCode ) : '-';
	//const monthlyPrice = cost && currencyCode ? getMonthlyPrice( cost, currencyCode ) : '-';

	const renderPerUserPerYear = () => {
		return translate( '{{strong}}%(price)s{{/strong}} per user / year', {
			components: {
				strong: <strong />,
			},
			args: {
				price: annualPrice,
			},
		} );
	};

	const renderPerUserPerMonth = () => {
		const precision = 1;
		const exponent = Math.pow( 10, precision );

		const monthlyPrice = Math.ceil( cost / 12 * exponent ) / exponent;

		const price = getCurrencyObject( monthlyPrice, currencyCode );

		return translate( '{{sup}}%(currencySymbol)s{{/sup}}{{strong}}%(integer)s{{/strong}}{{sub}}%(fraction)s{{/sub}} {{span}}per user/month{{/span}}', {
			components: {
				sup: <sup />,
				sub: <sub />,
				span: <span/>,
				strong: <strong />,
			},
			args: {
				currencySymbol: price.symbol,
				integer: price.integer,
				fraction: price.fraction,
			},
		} );
	};

	return (
		<div className="gsuite-price">
			<h4 className="gsuite-price__price-per-user">
				{ showMonthlyPrice ? renderPerUserPerMonth() : renderPerUserPerYear() }
			</h4>

			{ showMonthlyPrice && (
				<h5 className="gsuite-price__annual-price">
					{// translate( '{{del}}%(regularPrice)s{{/del}} %(discountedPrice)s billed annualy', {
						translate( '{{em}}billed annualy{{/em}} ', {
						components: {
							del: <del />,
							em: <em />,
						},
						args: {
							regularPrice: annualPrice,
							discountedPrice: discountedPrice,
						},
					} ) }

					<div>
						{ translate( '{{del}}%(regularPrice)s{{/del}} {{strong}}%(discountedPrice)s{{/strong}} first two months free' , {
							components: {
								del: <del />,
								strong: <strong />,
							},
							args: {
								regularPrice: annualPrice,
								discountedPrice: discountedPrice,
							},
						}) }
					</div>
				</h5>
			) }
		</div>
	);
};

GSuitePrice.propTypes = {
	cost: PropTypes.number,
	currencyCode: PropTypes.string,
	showMonthlyPrice: PropTypes.bool.isRequired,
};

GSuitePrice.defaultProps = {
	showMonthlyPrice: false,
};

export default GSuitePrice;
