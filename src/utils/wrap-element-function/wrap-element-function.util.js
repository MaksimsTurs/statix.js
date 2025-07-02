// @ts-check
"use strict";

/**
 *	@import {
 *		TStatixContextData
 *	} from "../../core/Statix-Context.core.type.js"; 
 */

/**
 *	@import { 
 *		TStatixMapWithFunctionsToWrap,
 *		TStatixMapWithWraperFunctions
 *	} from "./wrap-element-function.util.type.js"; 
 */

/**
 *	@template R, P
 *	@param    {TStatixMapWithFunctionsToWrap<R, P>} functionsObject
 *	@param    {TStatixContextData}                  contextData
 *	@returns  {TStatixMapWithWraperFunctions<R, P>} 
 */
export default function wrapElementFunctions(functionsObject, contextData) {
	/**	@type {TStatixMapWithWraperFunctions<R, P>} */
	const wraperFunctionsMap = {};
	
	for(let name in functionsObject) {
		wraperFunctionsMap[name] = (options) => {
			options.beforeCall?.(contextData);

			const wrapedFunction = functionsObject[name];
			const result = wrapedFunction(...options.args(contextData));

			options.afterCall?.(contextData, result);

			return result;
		}
	}

	return wraperFunctionsMap;
};