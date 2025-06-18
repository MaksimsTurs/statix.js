"use strict";

/**
 *	@typedef {Object<string, StatixSubscriberFunction>}                                                         StatixSignalSubscribers
 *	@typedef {(statix: StatixElement, signals: Object<string, StatixSignal>) => HTMLElement | DocumentFragment} StatixSubscriberFunction
 *
 * 	@typedef {any | ((value: any) => any)} NewValueOrUpdateCallback
 */

import StatixElement from "./Statix-Element.core.js";
import StatixContext from "./Statix-Context.core.js";
import { StatixInvalidTypeOrInstance } from "./Statix-Errors.core.js";

import { isFunction, isObject, isStatixElement } from "../utils/is.util.js";
import setStatixElementPhaseId from "../utils/set-statix-element-render-phase-id.util.js";

import { G_STATIX_SYMBOL_SUBSCRIBER_STATIX, G_STATIX_SYMBOL_SUBSCRIBER_SIGNAL } from "../../SYMBOL.const.js";
import { G_STATIX_TYPE_NAMES } from "../../STRING.const.js";
import { G_STATIX_RENDER_PHASE_IDS } from "../../NUMBER.const.js";

/**
 *	@version 0.0.1
 *	@description Class responsible for reactivity, provides functions for subscribing and 
 *	unsubscribing rendering functions and the ability to customize your own effects. 
 */
class StatixSignal {
	/**
	 *	@private
	 *	@field
	 *	@type {any | null}
	 */
	#value = null;
	/**
	 *	@private
	 *	@field
	 *	@type {StatixSignalSubscribers | null}
	 */
	#subscribers = null;
	/**
	 *	@constructor
	 *	@param {any} initValue 
	 */
	constructor(initValue) {
		this.#value = initValue;
		this.#subscribers = {};
	}
	/**
	 *	@returns {any} 
	 */
	get value() {
		return this.#value;
	}
	/**
	 *	@param   {NewValueOrUpdateCallback} newValueOrCallback
	 *	@returns {void}
	 */
	set value(newValueOrCallback) {	
		let tmp = null;

		if(isFunction(newValueOrCallback)) {
			tmp = newValueOrCallback(this.#value);
		} else {
			tmp = newValueOrCallback;
		}
		
		if(!Object.is(this.#value, tmp)) {
			this.#value = tmp;

			for(let subscriberName in this.#subscribers) {
				const subscriber = this.#subscribers[subscriberName];
				const statix = subscriber[G_STATIX_SYMBOL_SUBSCRIBER_STATIX];
				const signals = subscriber[G_STATIX_SYMBOL_SUBSCRIBER_SIGNAL];

				setStatixElementPhaseId(statix, G_STATIX_RENDER_PHASE_IDS.RENDER);

				StatixContext.push({ statix, signals });
								
				statix.render(...subscriber(statix, signals));

				StatixContext.pop();

				setStatixElementPhaseId(statix, G_STATIX_RENDER_PHASE_IDS.IDLE);
			}
		}
	}
	/**
	 *	@public
	 *	@method
	 *	@param   {Object<string, string>} subscribers
	 *	@returns {void} 
	 */
	subscribe(subscribers) {
		const { 0: statix, 2: signals, 4: views } = StatixContext.curr();
		
		if(!isObject(subscribers)) {
			throw new StatixInvalidTypeOrInstance(
				subscribers, 
				[G_STATIX_TYPE_NAMES.OBJECT], 
				"subscribers"
			);
		} else if(!isObject(signals)) {
			throw new StatixInvalidTypeOrInstance(
				signals, 
				[G_STATIX_TYPE_NAMES.OBJECT], 
				"signals"
			);
		} else if(!isStatixElement(statix)) {
			throw new StatixInvalidTypeOrInstance(
				statix, 
				[G_STATIX_TYPE_NAMES.STATIX_ELEMENT], 
				"statix"
			);
		}

		setStatixElementPhaseId(statix, G_STATIX_RENDER_PHASE_IDS.RENDER);

		for(let name in subscribers) {
			views[name][G_STATIX_SYMBOL_SUBSCRIBER_STATIX] = statix;
			views[name][G_STATIX_SYMBOL_SUBSCRIBER_SIGNAL] = signals;

			this.#subscribers[name] = views[name];

			if(!isFunction(views[name])) {
				throw new StatixInvalidTypeOrInstance(
					views[name], 
					[G_STATIX_TYPE_NAMES.FUNCTION], 
					"views[name]"
				);
			}
			
			statix.render(...views[name](statix, signals));
		}

		setStatixElementPhaseId(statix, G_STATIX_RENDER_PHASE_IDS.IDLE);
	}
	/**
	 *	@public
	 *	@method
	 * 	@param   {string[]} subscribers
	 *	@returns {void} 
	 */
	unsubscribe(...subscribers) {
		let index = 0;

		const length = subscribers.length;

		while(index < length) {
			delete this.#subscribers[subscribers[index]];

			index++;
		}
	}
};

export default StatixSignal;