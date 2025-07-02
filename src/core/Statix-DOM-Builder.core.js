// @ts-check
"use strict";

/**
 *	@import {
 *		TStatixElementChild,
 *		TStatixElementStyles,
 *		TStatixElementAttributes,
 *		TStatixElementDatasetAttributes
 *	} from "./Statix-DOM-Builder.core.type.js";
 */

import { StatixInvalidTypeOrInstance, StatixError } from "./Statix-Errors.core.js";

import appendChildWhenExist from "../utils/append-child-when-exist.util.js";
import protect from "../utils/protect.util.js";
import { isArray, isHTMLElement, isHTMLFragment } from "../utils/is.util.js";

import SYMBOL_CONST from "../../SYMBOL.const.js";
import STRING_CONST from "../../STRING.const.js";

/**
 *	@version     0.0.2
 *	@description The class responsible for creating DOM nodes. With this class you can create any UI element.
 */
class StatixDOMBuilder {
	/**
	 *	@constant
	 *	@type {HTMLElement | DocumentFragment} 
	 */
	// @ts-ignore
	[SYMBOL_CONST.HTML_ELEMENT] = null;
	/**
	 *	@param {HTMLElement | DocumentFragment} element
	 */
	constructor(element) {
		if(!isHTMLElement(element) && !isHTMLFragment(element)) {
			throw new StatixInvalidTypeOrInstance(element, [STRING_CONST.TYPE_NAMES.HTML_ELEMENT, STRING_CONST.TYPE_NAMES.HTML_FRAGMENT], "element");
		}

		protect(this, SYMBOL_CONST.HTML_ELEMENT, element);
	}
	/**
	 *	@param   {string} text
	 *	@returns {StatixDOMBuilder}
	 */
	text(text) {
		this[SYMBOL_CONST.HTML_ELEMENT].textContent = text;

		return this;
	}
	/**
	 * 	@param   {TStatixElementStyles} styles
	 *	@returns {StatixDOMBuilder} 
	 */
	styles(styles) {
		if(isHTMLFragment(this[SYMBOL_CONST.HTML_ELEMENT])) {
			throw new StatixError("DocumentFragmanet does not have a style property!");
		}

		for(let name in styles) {
			// @ts-ignore
			this[SYMBOL_CONST.HTML_ELEMENT].style[name] = styles[name];
		}

		return this;
	}
	/**
	 *	@param   {TStatixElementAttributes} attributes 
	 *	@returns {StatixDOMBuilder}
	 */
	attrs(attributes) {
		if(isHTMLFragment(this[SYMBOL_CONST.HTML_ELEMENT])) {
			throw new StatixError("DocumentFragmanet does not have a setAttribute function!");
		}

		for(let name in attributes) {
			// @ts-ignore
			this[SYMBOL_CONST.HTML_ELEMENT].setAttribute(name, attributes[name]);
		}

		return this;
	}
	/**
	 * 	@param   {TStatixElementDatasetAttributes} datasets
	 *	@returns {StatixDOMBuilder} 
	 */
	datasets(datasets) {
		if(isHTMLFragment(this[SYMBOL_CONST.HTML_ELEMENT])) {
			throw new StatixError("DocumentFragmanet does not have a setAttribute function!");
		}

		for(let name in datasets) {
			// @ts-ignore
			this[SYMBOL_CONST.HTML_ELEMENT].setAttribute(`data-${name}`, datasets[name]); 
		}

		return this;
	}
	/**
	 *	@param   {string | number} statixId
	 *	@returns {StatixDOMBuilder} 
	 */
	stxtid(statixId) {
		if(isHTMLFragment(this[SYMBOL_CONST.HTML_ELEMENT])) {
			throw new StatixError("DocumentFragmanet does not have a dataset property!");
		}

		// @ts-ignore
		this[SYMBOL_CONST.HTML_ELEMENT].dataset[STRING_CONST.JS_DATASET_NAMES.ID] = statixId;

		return this;
	}
	/**
	 *	@param   {string} statixActionName
	 *	@returns {StatixDOMBuilder} 
	 */
	stxtaction(statixActionName) {
		if(isHTMLFragment(this[SYMBOL_CONST.HTML_ELEMENT])) {
			throw new StatixError("DocumentFragmanet does not have a dataset property!");
		}

		// @ts-ignore
		this[SYMBOL_CONST.HTML_ELEMENT].dataset[STRING_CONST.JS_DATASET_NAMES.ACTION] = statixActionName;

		return this;
	}
	/**
	 *  @param   {string} [classes]
	 *  @returns {StatixDOMBuilder} 
	 */
	classes(classes) {
		if(isHTMLFragment(this[SYMBOL_CONST.HTML_ELEMENT])) {
			throw new StatixError("DocumentFragmanet does not have a className property!");
		}

		if(!classes) {
			// @ts-ignore
			this[SYMBOL_CONST.HTML_ELEMENT].removeAttribute("class");
		} else {
			// @ts-ignore
			this[SYMBOL_CONST.HTML_ELEMENT].className = classes;
		}

		return this;
	}
	/**
	 *	@param   {TStatixElementChild} child
	 *	@returns {StatixDOMBuilder} 
	 */
	child(child) {
		appendChildWhenExist(this[SYMBOL_CONST.HTML_ELEMENT], child?.[SYMBOL_CONST.HTML_ELEMENT] || child);

		return this;
	}
	/**
	 *	@param   {TStatixElementChild[] | TStatixElementChild[][]} childs
	 *	@returns {StatixDOMBuilder} 
	 */
	childs(...childs) {
		let outerIndex = 0;

		const outerLength = childs.length;
		
		while(outerIndex < outerLength) {
			if(isArray(childs[outerIndex])) {
				let innerIndex = 0;
				
				// @ts-ignore
				const innerLength = childs[outerIndex].length;
				
				while(innerIndex < innerLength) {
					appendChildWhenExist(this[SYMBOL_CONST.HTML_ELEMENT], childs[outerIndex][innerIndex]?.[SYMBOL_CONST.HTML_ELEMENT] || childs);
					innerIndex++;
				}
			} else {
				// @ts-ignore
				appendChildWhenExist(this[SYMBOL_CONST.HTML_ELEMENT], childs[outerIndex]);
			}

			outerIndex++;
		}

		return this;
	}
};

export default StatixDOMBuilder;