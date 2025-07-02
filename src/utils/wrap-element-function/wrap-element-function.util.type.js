// @ts-check
"use strict";

/**
 *	@import {
 *		TStatixContextData
 *	} from "../../core/Statix-Context.core.type.js"; 
 */

/**
 *	@template T
 *	@typedef {T extends any[] ? any[] : never} TStatixIterable 
 */

// Type fo map with wraped functions.
// R is Generic type for return value. P ist Generic type for parameter of function.
/**
 *	@template R, P
 *	@typedef  {Record<string, TStatixFunctionToWrap<R, TStatixIterable<P>>>} TStatixMapWithFunctionsToWrap
 */

// Type for single wraped function.
// R is Generic type for return value. P ist Generic type for parameter of function.
/**
 *	@template R, P
 *	@callback TStatixFunctionToWrap
 *	@param    {...P} args
 *	@returns  {R}
 */

/**
 *	@template R, P
 *	@typedef {Record<string, TStatixWraperFunction<R, TStatixIterable<P>>>} TStatixMapWithWraperFunctions 
 */

/**
 *	@template R, P
 *	@callback TStatixWraperFunction
 *	@param    {TStatixWraperFunctionOptions<R, TStatixIterable<P>>} options
 *	@returns  {R}
 */

/**
 *	@template R, P
 *	@typedef  {object}                                        TStatixWraperFunctionOptions
 *	@property {TStatixOptionArgsCallback<TStatixIterable<P>>} args
 *	@property {TStatixOptionBeforeCallCallback}               [beforeCall]
 *	@property {TStatixOptionAfterCallCallback<R>}             [afterCall]
 */

// Function to collect arguments for function.
/**
 *	@template P
 *	@callback TStatixOptionArgsCallback
 *	@param    {TStatixContextData} context
 *	@returns  {TStatixIterable<P>} 
 */

/**
 *	@callback TStatixOptionBeforeCallCallback
 *	@param    {TStatixContextData} context
 *	@returns  {void}
 */

/**
 *	@template R
 *	@callback TStatixOptionAfterCallCallback
 *	@param    {TStatixContextData} context
 *	@param    {R}                  result
 */

export {};