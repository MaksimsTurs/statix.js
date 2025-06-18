"use strict";

import StatixDOM from "./core/Statix-DOM.core.js";
import StatixContext from "./core/Statix-Context.core.js";
import { StatixInvalidTypeOrInstance } from "./core/Statix-Errors.core.js";

import { isString, isUndefined } from "./utils/is.util.js";

import { G_STATIX_SYMBOL_ELEMENT } from "../SYMBOL.const.js";
import { G_STATIX_TYPE_NAMES } from "../STRING.const.js";

/**
 *	@function
 *	@version     0.0.1
 *	@returns     {StatixDOM}
 *	@description Creates a document fragment, this document fragment can be used e.g. 
 *	if only part of the old DOM needs to be changed.
 */
export function fragment() {
	const { 0: statix } = StatixContext.curr();

	if(isUndefined(statix)) {
		throw new StatixInvalidTypeOrInstance(
			statix, 
			[G_STATIX_TYPE_NAMES.STATIX_ELEMENT], 
			"statix"
		);
	}

	return new StatixDOM(document.createDocumentFragment(), statix);
};

/**
 *	@function
 *	@version     0.0.1
 *	@returns     {StatixDOM}
 *	@description Creates a copy of the root element, can be used if you want to re-render the entire DOM tree.
 */
export function root() {	
	const { 0: statix } = StatixContext.curr();

	if(isUndefined(statix)) {
		throw new StatixInvalidTypeOrInstance(
			statix, 
			[G_STATIX_TYPE_NAMES.STATIX_ELEMENT], 
			"statix"
		);
	}

	return new StatixDOM(statix[G_STATIX_SYMBOL_ELEMENT].cloneNode(false), statix);
};

/**
 *	@function
 *	@version     0.0.1
 *	@param       {string}
 *	@returns     {StatixDOM}
 *	@description Creates new DOM nodes, this is used to create entire UI elements.
 */
export function tag(tagName) {
	const { 0: statix } = StatixContext.curr();

	if(!isString(tagName)) {
		throw new StatixInvalidTypeOrInstance(
			tagName, 
			[G_STATIX_TYPE_NAMES.STRING], 
			"tagName"
		);
	}

	if(isUndefined(statix)) {
		throw new StatixInvalidTypeOrInstance(
			statix, 
			[G_STATIX_TYPE_NAMES.STATIX_ELEMENT], 
			"statix"
		);
	}

	return new StatixDOM(document.createElement(tagName), statix);
};