// @ts-check
"use strict";

/**
 *	@import { 
 *		TStatixSubscribers,
 *		TStatixNewValueOrCallback
 *	} from "./Statix-Signal.core.type.js";
 */

/**
 *	@import { 
 *		TStatixElementViewReturn,
 *		TStatixElementViewsMap,
 *		TStatixElementViewFunction
 *	} from "../utils/create-statix/create-statix.util.type.js"; 
 */

/**
 *	@import { 
 *		TStatixWraperFunction 
 *	} from "../utils/wrap-element-function/wrap-element-function.util.type.js"; 
 */

import StatixElement from "./Statix-Element.core.js";
import StatixContext from "./Statix-Context.core.js";
import { StatixInvalidTypeOrInstance } from "./Statix-Errors.core.js";

import { isFunction, isUndefined, isObject } from "../utils/is.util.js";

import STRING_CONST from "../../STRING.const.js";

/**
 *	@template    T
 *	@version     0.0.2
 *	@description Class responsible for reactivity, provides functions for subscribing and 
 *	unsubscribing rendering functions and the ability to customize your own effects. 
 */
class StatixSignal {
	/**
	 *	@type {T | null | undefined}
	 */
	#value = null;
	/**
	 *	@type {TStatixSubscribers}
	 */
	#subscribers = {};

	constructor() {
		this.#subscribers = {};
	}
	/**
	 *	@returns {T | null | undefined} 
	 */
	get value() {
		return this.#value;
	}
	/**
	 *	@param   {TStatixNewValueOrCallback<T>} newValueOrCallback
	 *	@returns {void}
	 */
	set value(newValueOrCallback) {	
		/** @type {any} */
		let tmp = null;

		if(isFunction(newValueOrCallback)) {
			tmp = /** @type {(curr: T | null | undefined) => T} */ (newValueOrCallback)(this.#value);
		} else {
			tmp = newValueOrCallback;
		}
		
		if(!Object.is(this.#value, tmp)) {
			this.#value = tmp;

			for(let name in this.#subscribers) {
				const subscriber = this.#subscribers[name];

				subscriber({
					args: function(context) {
						return [context.statix, context.signals]
					},
					beforeCall: function(context) {
						if(isUndefined(context.statix)) {
							throw new StatixInvalidTypeOrInstance(context.statix, [STRING_CONST.STATIX_TYPE_NAMES.STATIX_ELEMENT], "context.statix");
						}
					},
					afterCall: function(context, result) {
						// @ts-ignore
						context.statix.render(...result)
					},
				});
			}
		}
	}
	/**
	 *	@template {T | null | undefined} T
	 *	@param    {T}                    initValue
	 *	@returns  {void} 
	 */
	init(initValue) {
		this.#value = initValue;
	}
	/**
	 *	@param   {TStatixElementViewsMap} subscribers
	 *	@returns {void} 
	 */
	subscribe(subscribers) {
		const instance = StatixContext.current();

		if(!isObject(subscribers)) {
			throw new StatixInvalidTypeOrInstance(subscribers, [STRING_CONST.STATIX_TYPE_NAMES.OBJECT], "subscribers");
		}
		
		if(isUndefined(instance?.views)) {
			throw new StatixInvalidTypeOrInstance(instance?.views, [STRING_CONST.STATIX_TYPE_NAMES.OBJECT], "instance.views");
		} else if(isUndefined(instance?.actions)) {
			throw new StatixInvalidTypeOrInstance(instance?.actions, [STRING_CONST.STATIX_TYPE_NAMES.OBJECT], "instance.actions");
		} else if(isUndefined(instance?.signals)) {
			throw new StatixInvalidTypeOrInstance(instance?.signals, [STRING_CONST.STATIX_TYPE_NAMES.OBJECT], "instance.signals");
		} else if(isUndefined(instance?.statix)) {
			throw new StatixInvalidTypeOrInstance(instance?.statix, [STRING_CONST.STATIX_TYPE_NAMES.STATIX_ELEMENT], "instance.statix");
		}

		for(let name in subscribers) {
			/** @type {TStatixWraperFunction<TStatixElementViewReturn, Parameters<TStatixElementViewFunction>>} */
			// @ts-ignore
			const view = instance.views[name];

			/** @type {StatixElement} */
			// @ts-ignore
			const statix = instance.statix;

			statix.render(...view({ 
				args: function(context) {
					return [context.statix, context.signals]
				}
			}));

			this.#subscribers[name] = view;
		}
	}
	/**
	 * 	@param   {string[]} names
	 *	@returns {void} 
	 */
	unsubscribe(names) {
		let index = 0;

		const length = names.length;

		while(index < length) {
			delete this.#subscribers[names[index]];

			index++;
		}
	}
};

export default StatixSignal;