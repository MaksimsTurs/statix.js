// @ts-check
"use strict";

// Core functions.
import createStatix from "./utils/create-statix/create-statix.util.js";
import createSignal from "./utils/create-signal/create-signal.util.js";

// Core classes.
import StatixDOMBuilder from "./core/Statix-DOM-Builder.core.js";
import StatixContext from "./core/Statix-Context.core.js";
import { StatixInvalidTypeOrInstance } from "./core/Statix-Errors.core.js";

import { isStatixElement } from "./utils/is.util.js";
import copyAllDelegateEvents from "./utils/copy-all-delegate-events.util.js";

import SYMBOL_CONST from "../SYMBOL.const.js";
import STRING from "../STRING.const.js";

/**
 *	@version     0.0.2
 *	@returns     {StatixDOMBuilder}
 *	@description Creates a document fragment, this document fragment can be used e.g. 
 *	if only part of the old DOM needs to be changed.
 */
export function fragment() {
	return new StatixDOMBuilder(document.createDocumentFragment());
};

/**
 *	@version     0.0.2
 *	@param 			 {boolean} shouldDelegateEventsCopied
 *	@returns     {StatixDOMBuilder}
 *	@description Creates a copy of the root element, can be used if you want to re-render the entire DOM tree.
 */
export function root(shouldDelegateEventsCopied = true) {	
	const instance = StatixContext.current();

	if(!isStatixElement(instance?.statix)) {
		throw new StatixInvalidTypeOrInstance(instance?.statix, [STRING.TYPE_NAMES.STATIX_ELEMENT], "instance.statix");
	}
	
	/** @type {HTMLElement} */
	// @ts-ignore
	const root = instance?.statix[SYMBOL_CONST.HTML_ELEMENT];
	/** @type {HTMLElement} */
	// @ts-ignore
	const rootClone = instance?.statix[SYMBOL_CONST.HTML_ELEMENT].cloneNode(false)

	if(shouldDelegateEventsCopied) {
		copyAllDelegateEvents(root, rootClone);
	}

	return new StatixDOMBuilder(rootClone);
};

/**
 *	@version     0.0.2
 *	@param       {keyof HTMLElementTagNameMap} tagName
 *	@returns     {StatixDOMBuilder}
 *	@description Creates new DOM nodes, this is used to create entire UI elements.
 */
export function tag(tagName) {
	return new StatixDOMBuilder(document.createElement(tagName));
};

export default {
	create: createStatix,
	signal: createSignal
};