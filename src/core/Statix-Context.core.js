// @ts-check
"use strict";

/**
 *	@import {
 *		TStatixContextData
 *	} from "./Statix-Context.core.type.js"; 
 */

/**
 *	@version 0.0.2 
 */
const StatixContext = {
	/**
	 *	@param   {TStatixContextData} context
	 *	@returns {void} 
	 */
	push: function(context) {
		this.STATIX_ELEMENTS.push(context);
	},
	/**
	 *	@returns {void} 
	 */
	pop: function() {
		this.STATIX_ELEMENTS.pop();
	},
	/**
	 *	@returns {TStatixContextData | undefined} 
	 */
	current: function() {
		return this.STATIX_ELEMENTS.at(-1);
	},
	/**
	 *	@param   {number} index
	 *	@returns {TStatixContextData | undefined} 
	 */
	at: function(index) {
		return this.STATIX_ELEMENTS.at(index);
	},
	/**
	 *	@return {Generator<TStatixContextData, void>} 
	 */
	next: function*() {
		const length = this.length();

		while(this.CURR_CONTEXT_INDEX < length) {
			yield this.STATIX_ELEMENTS.at(this.CURR_CONTEXT_INDEX);

			this.CURR_CONTEXT_INDEX++;
		}
	},
	/**
	 *	@return {Generator<TStatixContextData, void>} 
	 */
	prev: function*() {
		while(this.CURR_CONTEXT_INDEX > 0) {
			yield this.STATIX_ELEMENTS.at(this.CURR_CONTEXT_INDEX);

			this.CURR_CONTEXT_INDEX--;
		}
	},
	/**
	 *	@returns {number} 
	 */
	length: function() {
		return this.STATIX_ELEMENTS.length;
	}
};

Object.defineProperties(StatixContext, {
	STATIX_ELEMENTS: {
		configurable: false,
		enumerable: false,
		writable: false,
		value: []
	},
	CURR_CONTEXT_INDEX: {
		configurable: false,
		enumerable: false,
		writable: true,
		value: 0
	}
});

export default StatixContext;