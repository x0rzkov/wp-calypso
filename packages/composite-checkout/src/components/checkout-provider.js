/**
 * External dependencies
 */
import React, { useContext, useEffect, useMemo, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider } from 'emotion-theming';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import CheckoutContext from '../lib/checkout-context';
import CheckoutErrorBoundary from './checkout-error-boundary';
import { LocalizeProvider } from '../lib/localize';
import { LineItemsProvider } from '../lib/line-items';
import { RegistryProvider, createRegistry } from '../lib/registry';
import { useFormStatusManager } from '../lib/form-status';
import defaultTheme from '../theme';
import {
	validateArg,
	validateTotal,
	validateLineItems,
	validatePaymentMethods,
} from '../lib/validation';

const debug = debugFactory( 'composite-checkout:checkout-provider' );

export const CheckoutProvider = props => {
	const {
		locale,
		total,
		items,
		onPaymentComplete,
		showErrorMessage,
		showInfoMessage,
		showSuccessMessage,
		successRedirectUrl,
		failureRedirectUrl,
		theme,
		paymentMethods,
		registry,
		onEvent,
		isLoading,
		children,
	} = props;
	const [ paymentMethodId, setPaymentMethodId ] = useState(
		paymentMethods ? paymentMethods[ 0 ].id : null
	);

	const [ formStatus, setFormStatus ] = useFormStatusManager( isLoading );
	useEffect( () => {
		if ( formStatus === 'complete' ) {
			debug( "form status is complete so I'm calling onPaymentComplete" );
			onPaymentComplete();
		}
	}, [ formStatus, onPaymentComplete ] );

	// Remove undefined and duplicate CheckoutWrapper properties
	const wrappers = [
		...new Set( paymentMethods.map( method => method.CheckoutWrapper ).filter( Boolean ) ),
	];
	debug( `applying ${ wrappers.length } CheckoutWrapper wrappers` );

	// Create the registry automatically if it's not a prop
	const registryRef = useRef( registry );
	registryRef.current = registryRef.current || createRegistry();

	const value = useMemo(
		() => ( {
			allPaymentMethods: paymentMethods,
			paymentMethodId,
			setPaymentMethodId,
			showErrorMessage,
			showInfoMessage,
			showSuccessMessage,
			successRedirectUrl,
			failureRedirectUrl,
			onEvent: onEvent || ( () => {} ),
			formStatus,
			setFormStatus,
		} ),
		[
			failureRedirectUrl,
			formStatus,
			onEvent,
			paymentMethodId,
			paymentMethods,
			setFormStatus,
			showErrorMessage,
			showInfoMessage,
			showSuccessMessage,
			successRedirectUrl,
		]
	);

	// This error message cannot be translated because translation hasn't loaded yet.
	const errorMessage = 'Sorry, there was an error loading this page';
	return (
		<CheckoutErrorBoundary errorMessage={ errorMessage }>
			<CheckoutProviderPropValidator propsToValidate={ props } />
			<ThemeProvider theme={ theme || defaultTheme }>
				<RegistryProvider value={ registryRef.current }>
					<LocalizeProvider locale={ locale }>
						<LineItemsProvider items={ items } total={ total }>
							<CheckoutContext.Provider value={ value }>
								<PaymentMethodWrapperProvider wrappers={ wrappers }>
									{ children }
								</PaymentMethodWrapperProvider>
							</CheckoutContext.Provider>
						</LineItemsProvider>
					</LocalizeProvider>
				</RegistryProvider>
			</ThemeProvider>
		</CheckoutErrorBoundary>
	);
};

CheckoutProvider.propTypes = {
	theme: PropTypes.object,
	registry: PropTypes.object,
	locale: PropTypes.string.isRequired,
	total: PropTypes.object.isRequired,
	items: PropTypes.arrayOf( PropTypes.object ).isRequired,
	paymentMethods: PropTypes.arrayOf( PropTypes.object ).isRequired,
	paymentMethodId: PropTypes.string,
	onPaymentComplete: PropTypes.func.isRequired,
	showErrorMessage: PropTypes.func.isRequired,
	showInfoMessage: PropTypes.func.isRequired,
	showSuccessMessage: PropTypes.func.isRequired,
	successRedirectUrl: PropTypes.string.isRequired,
	failureRedirectUrl: PropTypes.string.isRequired,
	onEvent: PropTypes.func,
	isLoading: PropTypes.bool,
};

function CheckoutProviderPropValidator( { propsToValidate } ) {
	const {
		locale,
		total,
		items,
		onPaymentComplete,
		showErrorMessage,
		showInfoMessage,
		showSuccessMessage,
		successRedirectUrl,
		failureRedirectUrl,
		paymentMethods,
	} = propsToValidate;
	useEffect( () => {
		debug( 'propsToValidate', propsToValidate );

		validateArg( locale, 'CheckoutProvider missing required prop: locale' );
		validateArg( total, 'CheckoutProvider missing required prop: total' );
		validateTotal( total );
		validateArg( items, 'CheckoutProvider missing required prop: items' );
		validateLineItems( items );
		validateArg( paymentMethods, 'CheckoutProvider missing required prop: paymentMethods' );
		validatePaymentMethods( paymentMethods );
		validateArg( onPaymentComplete, 'CheckoutProvider missing required prop: onPaymentComplete' );
		validateArg( showErrorMessage, 'CheckoutProvider missing required prop: showErrorMessage' );
		validateArg( showInfoMessage, 'CheckoutProvider missing required prop: showInfoMessage' );
		validateArg( showSuccessMessage, 'CheckoutProvider missing required prop: showSuccessMessage' );
		validateArg( successRedirectUrl, 'CheckoutProvider missing required prop: successRedirectUrl' );
		validateArg( failureRedirectUrl, 'CheckoutProvider missing required prop: failureRedirectUrl' );
	}, [
		failureRedirectUrl,
		items,
		locale,
		onPaymentComplete,
		paymentMethods,
		propsToValidate,
		showErrorMessage,
		showInfoMessage,
		showSuccessMessage,
		successRedirectUrl,
		total,
	] );
	return null;
}

function PaymentMethodWrapperProvider( { children, wrappers } ) {
	return wrappers.reduce( ( whole, Wrapper ) => {
		return <Wrapper>{ whole }</Wrapper>;
	}, children );
}

export function useEvents() {
	const { onEvent } = useContext( CheckoutContext );
	if ( ! onEvent ) {
		throw new Error( 'useEvents can only be used inside a CheckoutProvider' );
	}
	return onEvent;
}

export function useMessages() {
	const { showErrorMessage, showInfoMessage, showSuccessMessage } = useContext( CheckoutContext );
	if ( ! showErrorMessage || ! showInfoMessage || ! showSuccessMessage ) {
		throw new Error( 'useMessages can only be used inside a CheckoutProvider' );
	}
	return { showErrorMessage, showInfoMessage, showSuccessMessage };
}

export const useCheckoutRedirects = () => {
	const { successRedirectUrl, failureRedirectUrl } = useContext( CheckoutContext );
	if ( ! successRedirectUrl || ! failureRedirectUrl ) {
		throw new Error( 'useCheckoutRedirects can only be used inside a CheckoutProvider' );
	}
	return { successRedirectUrl, failureRedirectUrl };
};
