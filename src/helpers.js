"use strict"

/**
 *	@callback  StatixDelayFunction
 *	@param     {(...args: any[]) => any} callback
 *	@param     {number}                  delay
 *	@returns   {StatixDelayFunctionReturn}
 *
 *	@callback  StatixDelayFunctionReturn
 *	@param     {any[]} args
 *	@returns   {any}
 */

export default {
	/**
	 *	@type {StatixDelayFunction}
	 */
	debounce(callback, delay) {
		let timerId = 0;
	
		return function(...args) {
			clearTimeout(timerId);
			timerId = setTimeout(() => callback(...args), delay);
		}
	},
	/**
	 *	@type {StatixDelayFunction}
	 */
	throttle(callback, delay) {
		let timerId = null;
	
		return function(...args) {
			if(!timerId) {
				callback(...args);
				timerId = setTimeout(() => {
					timerId = null;
				}, delay);
			}
		}
	}
};