// @ts-check
"use strict";

import StatixElement from "../../core/Statix-Element.core";
import StatixSignal from "../../core/Statix-Signal.core";
import StatixDOM from "../../core/Statix-DOM.core.js";

/**
 *	@import { TStatixElementRenderOptions } from "../../core/Statix-Element.core.type.js" 
 */

/**
 *	@template T
 *	@callback TStatixCreateElementConfigurationFunction
 *	@param    {TStatixCreateElementOptions<T>}    options
 *	@returns  {TStatixCreateElementFunction<any>}
 */

/**
 *	@template T
 *	@typedef  {object}                        TStatixCreateElementOptions
 *	@property {TStatixElementInitFunction<T>} init
 *	@property {TStatixElementViews}           views
 *	@property {TStatixElementActions}         actions
 *	@property {TStatixElementSignals}         signals
 */

/**
 *	@description In init function you can define element actions and subscribe the view functions to the signals.
 *	@template T
 *	@callback TStatixElementInitFunction
 *	@param    {StatixElement}          statix
 *	@param	  {TStatixElementViewsMap} views
 *	@param	  {TStatixElementSignals}  signals
 *	@param    {T}                      props
 *	@returns  {void}
 */

/**
 *	@description In views function you define the render functions that will render you UI.
 *	@typedef  {Record<string, TStatixElementViewFunction>} TStatixElementViews
 *	@callback TStatixElementViewFunction
 *	@param    {StatixElement}         statix
 *	@param    {TStatixElementSignals} signals
 *	@returns  {TStatixElementViewReturn}
 */

/**
 *	@typedef {[DocumentFragment | StatixDOM, TStatixElementRenderOptions | undefined]} TStatixElementViewReturn 
 */

/**
 *	@description We don't won't that user can acess and execute view functions in init function, for this
 *	reason we pass only object with names of view function to user.
 *	@typedef {Record<keyof TStatixElementViews, keyof TStatixElementViews>} TStatixElementViewsMap 
 */

/**
 *	@description In acion object you define functions that you delegate.
 *	@typedef  {Record<string, TStatixElementActionFunction>} TStatixElementActions
 *	@callback TStatixElementActionFunction
 *	@param    {StatixElement}         statix
 *	@param    {TStatixElementSignals} signals
 *	@param    {Event}                 event
 *	@returns  {void}
 */

/**
 *	@typedef  {Record<string, StatixSignal>} TStatixElementSignals
 */

/**
 *	@template P
 *	@callback TStatixCreateElementFunction
 *	@param    {TStatixCreateElementFunctionProps<P>} props
 *	@returns  {void}
 */

/**
 *	@template P
 *	@typedef  {object} TStatixCreateElementFunctionProps<P>
 *	@property {P}                     data
 *	@property {string}                bind
 *	@property {TStatixElementSignals} signals
 */

export {};