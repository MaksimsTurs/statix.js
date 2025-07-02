// @ts-check
"use strict";

/**
 *	@import { 
 *		TStatixCreateElementConfigurationFunction,
 *		TStatixCreateElementFunction
 *	} from "./create-statix.util.type.js"; 
 */

import StatixContext from "../../core/Statix-Context.core.js";
import StatixElement from "../../core/Statix-Element.core.js";

import collectKeysInObject from "../collect-keys-in-object.util.js";
import wrapElementFunction from "../wrap-element-function/wrap-element-function.util.js";

/**
 *	@version  0.0.2
 *	@template T
 *	@type     {TStatixCreateElementConfigurationFunction<T>}
 */
export default function createStatix(options) {
	/**
	 *	@template {null | undefined} T
	 *	@type     {TStatixCreateElementFunction<T>}
	 */
	return function(props) {
		const element = new StatixElement();
		const signals = {...props.signals, ...options.signals };
		const contextData = { 
			statix: element,
			signals: options.signals,
			actions: {},
			views: {}
		};

		// @ts-ignore
		contextData.views = wrapElementFunction(options.views, contextData);
		// @ts-ignore
		contextData.actions = wrapElementFunction(options.actions, contextData);

		element.bind(props.bind);
	
		// @ts-ignore
		StatixContext.push(contextData);

		// I don't won't that users can execute the view functions in init function
		// therefore i will pass only object with names of view functions.
		options.init(element, collectKeysInObject(options.views), signals, props.data);

		StatixContext.pop();
	}
};