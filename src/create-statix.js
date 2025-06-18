"use strict";

/**
 *	@import { StatixElementRenderOptions } from "./core/Statix-Element.core.js"
 *
 *	@template T
 *	@typedef  {Object}                       StatixElementCreateOptions
 *	@property {StatixElementInitFunction<T>} init
 *	Function used for configuring element actions and subscribing view functions to signals.
 *	@property {StatixElementViews}           views
 *	Object with rendering functions.
 *	@property {StatixElementActions}         actions
 *	Object with action functions.
 *	@property {StatixElementSignals}         signals
 *	Object with local signals.
 *
 *	--------------------------------------------------------------------------------------------
 *
 * 	@template T
 *  @typedef  {Object}               StatixElementProps<any>
 *  @property {T}                    data
 *  @property {StatixElementSignals} signals
 *  @property {string}               bind
 *
 *	--------------------------------------------------------------------------------------------
 * 
 *	@template T
 *	@callback StatixElementInitFunction<any>
 *	@param    {StatixElement}          statix
 *	@param    {Object<string, string>} views
 *	@param    {StatixElementSignals}   signals
 *	@param    {T}                      props
 *
 *  --------------------------------------------------------------------------------------------
 * 
 * 	@typedef  {[HTMLElement | DocumentFragment, StatixElementRenderOptions | undefined]} StatixElementRenderData
 *	@typedef  {Object<string, StatixElementViewFunction>}                                StatixElementViews
 *
 *	@callback StatixElementViewFunction
 *	@param    {StatixElement}        statix
 *	@param    {StatixElementSignals} signals
 *	@returns  {StatixElementRenderData}
 * 
 *  --------------------------------------------------------------------------------------------
 * 
 *  @typedef {Object<string, StatixElementActionFunction>} StatixElementActions
 *
 *	@callback StatixElementActionFunction
 *	@param    {StatixElement}        statix
 *	@param    {StatixElementSignals} signals
 *	@returns  {void}
 * 
 *  --------------------------------------------------------------------------------------------
 *
 *  @typedef {Object<string, StatixSignal>} StatixElementSignals
 */

import StatixElement from "./core/Statix-Element.core.js";
import StatixContext from "./core/Statix-Context.core.js";
import StatixSignal from "./core/Statix-Signal.core.js";
import { StatixInvalidTypeOrInstance } from "./core/Statix-Errors.core.js";

import { isInObject, isFunction, isObject, isString } from "./utils/is.util.js";
import collectKeysInObject from "./utils/collect-keys-in-object.util.js";

import { G_STATIX_TYPE_NAMES } from "../STRING.const.js";

/**
 *	@version     0.0.1
 *	@param       {StatixElementCreateOptions<any>} options
 *	@returns     {void}
 *	@description 
 *	You must provide all option fileds!
 *	Function for creating and setting up the element, e.g. its actions or subscribing to signals.
 */
export default function createStatix(options) {
	if(!isInObject("init", options) ||
		 !isInObject("views", options) ||
		 !isInObject("signals", options) ||
		 !isInObject("actions", options)) {
	  throw new StatixInvalidTypeOrInstance(
			options?.actions || options?.init || options?.signals || options?.views,
			[G_STATIX_TYPE_NAMES.FUNCTION, G_STATIX_TYPE_NAMES.OBJECT],
			!options?.actions ? "options.actions" : !options?.init ? "options.init" : !options.signals ? "options.signals" : !options.views ? "options.views" : "Unknown"
		);
	}

	if(!isObject(options.views) ||
		 !isObject(options.signals) ||
		 !isObject(options.actions)) {
	  throw new StatixInvalidTypeOrInstance(
			!isObject(options.views) ? options.views : !isObject(options.signals) ? options.signals : !isObject(options.actions) ? options.actions : {},
			[G_STATIX_TYPE_NAMES.OBJECT],
			!isObject(options.views) ? "options.views" : !isObject(options.signals) ? "options.signals" : !isObject(options.actions) ? "options.actions" : "Unknown",
		);
	}

	if(!isFunction(options.init)) {
		throw new StatixInvalidTypeOrInstance(options.init, [G_STATIX_TYPE_NAMES.FUNCTION], "options.config");
	}

	/**
	 *	@param   {StatixElementProps<any>} props
	 *	@returns {void}
	 */
	return function(props) {
		if(!isInObject("data", props) ||
		   !isInObject("bind", props) ||
		   !isInObject("signals", props)) {
			throw new StatixInvalidTypeOrInstance(
				props?.data || props?.bind || props?.signals,
				[G_STATIX_TYPE_NAMES.OBJECT],
				!props?.data ? "props.data" : !props?.bind ? "props.bind" : !props.signals ? "props.signals" : "Unknown"
			);
		}

		if(!isObject(props.signals)) {
			throw new StatixInvalidTypeOrInstance(props.signals, [G_STATIX_TYPE_NAMES.OBJECT], "props.signals");
		}

		if(!isString(props.bind)) {
			throw new StatixInvalidTypeOrInstance(props.bind, [G_STATIX_TYPE_NAMES.STRING], "props.bind");
		}

		const element = new StatixElement();
		const signals = {...props.signals, ...options.signals };

		element.bind(props.bind);
		// This context data will be used in statix and signal methods.
		StatixContext.push({ statix: element, signals, actions: options.actions, views: options.views });

		delete props.signals;
		delete props.bind;

		options.init.call(null, ...[element, collectKeysInObject(options.views), signals, props]);

		StatixContext.pop();
	}
};