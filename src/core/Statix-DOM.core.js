"use strict";

/**
 *	@typedef {DocumentFragment | HTMLElement | StatixElement} StatixElementChild 
 */

import appendChildWhenExist from "../utils/append-child-when-exist.util.js";
import protect from "../utils/protect.util.js";
import { isArray } from "../utils/is.util.js";

import StatixElement from "./Statix-Element.core.js";

import { G_STATIX_SYMBOL_ELEMENT } from "../../SYMBOL.const.js";
import { G_STATIX_JS_DATASET_NAMES } from "../../STRING.const.js";

/**
 *	@version     0.0.1
 *	@description The class responsible for creating DOM nodes. With this class you can create any UI element.
 */
class StatixDOM {
	/**
	 *  @type {StatixElement}
	 *  @private
	 *	@field
	 * 	@constant
	 */
	#statix = null;
	/**
	 *	@constructor
	 *	@param {HTMLElement | DocumentFragment} element
	 *	@param {StatixElement}                  statixInstance
	 */
	constructor(element, statixInstance) {
		this.#statix = statixInstance;

		protect(this, G_STATIX_SYMBOL_ELEMENT, element);
	}
	/**
	 *	@public
	 * 	@method
	 *	@param   {string} text
	 *	@returns {StatixDOM}
	 */
	text(text) {
		this[G_STATIX_SYMBOL_ELEMENT].textContent = text;

		return this;
	}
	/**
	 *	@public
	 * 	@method
	 * 	@param   {Object<string, string>} styles
	 *	@returns {StatixDOM} 
	 */
	styles(styles) {
		for(let name in styles) {
			this[G_STATIX_SYMBOL_ELEMENT].style[name] = styles[name];
		}

		return this;
	}
	/**
	 *	@public
	 * 	@method
	 *	@param   {Object<string, string | number | symbol | boolean>} attributes 
	 *	@returns {void}
	 */
	attrs(attributes) {
		for(let name in attributes) {
			this[G_STATIX_SYMBOL_ELEMENT].setAttribute(name, attributes[name]);
		}

		return this;
	}
	/**
	 *	@public
	 * 	@method
	 * 	@param   {Object<string, string | number | symbol | boolean>} datasets
	 *	@returns {StatixDOM} 
	 */
	datasets(datasets) {
		for(let name in datasets) {
			this[G_STATIX_SYMBOL_ELEMENT].setAttribute(`data-${name}`, datasets[name]); 
		}

		return this;
	}
	/**
	 *	@public
	 * 	@method
	 *	@param   {string | number | symbol} statixId
	 *	@returns {StatixDOM} 
	 */
	stxtid(statixId) {
		this[G_STATIX_SYMBOL_ELEMENT].dataset[G_STATIX_JS_DATASET_NAMES.ID] = statixId;

		return this;
	}
	/**
	 *	@public
	 * 	@method
	 *	@param   {string} statixActionName
	 *	@returns {StatixDOM} 
	 */
	stxtaction(statixActionName) {
		this[G_STATIX_SYMBOL_ELEMENT].dataset[G_STATIX_JS_DATASET_NAMES.ACTION] = statixActionName;

		return this;
	}
	/**
	 *	@public
	 * 	@method
	 *  @param   {string[]}  classes
	 *  @returns {StatixDOM} 
	 */
	classes(classes) {
		this[G_STATIX_SYMBOL_ELEMENT].classList.add(...classes);

		return this;
	}
	/**
	 *	@public
	 * 	@method
	 *  @param   {keyof GlobalEventHandlersEventMap}  type
	 *  @param   {EventListenerOrEventListenerObject} callback
	 *  @param   {AddEventListenerOptions}            options
	 *  @returns {StatixDOM} 
	 */
	event(type, callback, options) {
		this[G_STATIX_SYMBOL_ELEMENT].addEventListener(type, callback.bind(null, this.#statix), options);

		return this;
	}
	/**
	 *	@public
	 * 	@method
	 *	@param   {StatixElementChild} child
	 *	@returns {StatixDOM} 
	 */
	child(child) {
		appendChildWhenExist(this[G_STATIX_SYMBOL_ELEMENT], child?.[G_STATIX_SYMBOL_ELEMENT] || child);

		return this;
	}
	/**
	 *	@public
	 * 	@method
	 *	@param   {StatixElementChild[] || StatixElementChild[][]} childs
	 *	@returns {StatixDOM} 
	 */
	childs(...childs) {
		let outerIndex = 0;

		const outerLength = childs.length;
		const fragment = document.createDocumentFragment();
		
		while(outerIndex < outerLength) {
			if(isArray(childs[outerIndex])) {
				let innerIndex = 0;
				
				const innerLength = childs[outerIndex].length;
				
				while(innerIndex < innerLength) {
					appendChildWhenExist(fragment, childs[outerIndex][innerIndex]?.[G_STATIX_SYMBOL_ELEMENT] || childs);
					innerIndex++;
				}
			} else {
				appendChildWhenExist(fragment, childs[outerIndex]);
			}

			outerIndex++;
		}

		this[G_STATIX_SYMBOL_ELEMENT].appendChild(fragment);

		return this;
	}
};

export default StatixDOM;