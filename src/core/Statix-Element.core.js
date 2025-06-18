"use strict"

/**
 * 	@typedef  {Object}             StatixElementMetadata
 * 	@property {HTMLElement | null} placeholderElement
 * 	Placeholder element is used to add the element in the right place without depending on other elements.
 *	@property {Set<string>}        usedEventListenerTypes
 * 
 *  --------------------------------------------------------------------------------------------
 * 
 * 	@typedef  {Object}                        StatixElementReplaceRootWithOptions
 * 	@property {string | undefined}            selector
 * 	@property {number | number[] | undefined} at
 * 
 *  --------------------------------------------------------------------------------------------
 * 
 *	@typedef  {Object}                                          StatixElementRenderOptions
 *	@property {StatixElementReplaceRootWithOptions | undefined} replaceRootWith
 */

import { 
	StatixInvalidTypeOrInstance,
	StatixError,
	StatixElementIsBinded
} from "./Statix-Errors.core.js";
import StatixDOM from "./Statix-DOM.core.js";
import StatixContext from "./Statix-Context.core.js";

import {
	isHTMLElement,
	isNull,
	isArray,
	isString,
	isUndefined,
	isStatixDOM,
} from "../utils/is.util.js";
import diff from "../utils/diff.util.js";
import protect from "../utils/protect.util.js";
import getRootFromOptions from "../utils/get-root-from-options.util.js";

import { 
	G_STATIX_RENDER_PHASE_IDS 
} from "../../NUMBER.const.js";
import { 
	G_STATIX_HTML_DATASET_NAMES, 
	G_STATIX_JS_DATASET_NAMES,
	G_STATIX_TYPE_NAMES
} from "../../STRING.const.js";
import { 
	G_STATIX_SYMBOL_ELEMENT, 
	G_STATIX_SYMBOL_PHASE_ID,
	G_STATIX_SYMBOL_SET_PHASE_ID
} from "../../SYMBOL.const.js";

/**
 *  @version     0.0.1
 *	@description Main class responsible for synchronization of rendering, 
 *	life cycles of the element, DOM patching, mounting and unmounting of the element.
 */
class StatixElement {
	/**
	 *	@type {StatixElementMetadata | null} 
	 *  @private
	 *	@field
	 * 	@constant
	 */
	#metadata = null;
	/**
	 *	@constructor 
	 */
	constructor() {
		this.#metadata = { placeholderElement: null, usedEventListenerTypes: new Set() };
		// This is a class properties that i need to have access outer the class instance.
		protect(this, G_STATIX_SYMBOL_PHASE_ID, G_STATIX_RENDER_PHASE_IDS.INIT);
		protect(this, G_STATIX_SYMBOL_ELEMENT, null);
	}
	/**
	 *	@public
	 *	@method
	 *	@param   {string} key
	 *	@returns {void} 
	 */
	bind(key) {
		this.#setRenderPhaseId(G_STATIX_RENDER_PHASE_IDS.MOUNT);

		if(!isNull(this[G_STATIX_SYMBOL_ELEMENT]) && !isUndefined(this[G_STATIX_SYMBOL_ELEMENT])) {
			this.#setRenderPhaseId(G_STATIX_RENDER_PHASE_IDS.IDLE);
			throw new StatixElementIsBinded();
		}

		const maybeExistedElement = document.querySelector(`[data-${G_STATIX_HTML_DATASET_NAMES.BIND}="${key}"]`);
		const placeholderElement = document.createElement("span");

		placeholderElement.dataset.statixBind = key;
		placeholderElement.style.display = "none";

		if(!isHTMLElement(maybeExistedElement)) {
			this.#setRenderPhaseId(G_STATIX_RENDER_PHASE_IDS.IDLE);
			throw new StatixInvalidTypeOrInstance(maybeExistedElement, HTMLElement, "maybeExistedElement");
		}

		this[G_STATIX_SYMBOL_ELEMENT] = maybeExistedElement;
		this.#metadata.placeholderElement = placeholderElement;
		
		this.#setRenderPhaseId(G_STATIX_RENDER_PHASE_IDS.IDLE);
	}
	/**
	 *	@public
	 *	@method
	 *	@returns {void} 
	 */
	mount() {
		if(!this[G_STATIX_SYMBOL_ELEMENT].parentElement) {
			this.#setRenderPhaseId(G_STATIX_RENDER_PHASE_IDS.MOUNT);

			document
				.querySelector(`[data-${G_STATIX_HTML_DATASET_NAMES.BIND}="${this[G_STATIX_SYMBOL_ELEMENT].dataset.statixBind}"]`)
				.replaceWith(this[G_STATIX_SYMBOL_ELEMENT]);

			this.#setRenderPhaseId(G_STATIX_RENDER_PHASE_IDS.IDLE);
		}
	}
	/**
	 *	@public
	 *	@method
	 *	@returns {void} 
	 */
	unmount() {
		if(this[G_STATIX_SYMBOL_ELEMENT].parentNode) {
			this.#setRenderPhaseId(G_STATIX_RENDER_PHASE_IDS.UNMOUNT);
			
			this[G_STATIX_SYMBOL_ELEMENT].replaceWith(this.#metadata.placeholderElement);

			this.#setRenderPhaseId(G_STATIX_RENDER_PHASE_IDS.IDLE);
		}
	}
	/**
	 *	@public
	 *	@method
	 *	@param   {DocumentFragment | StatixDOM} newDOMTree
	 *	@param   {StatixElementRenderOptions}   options
	 *	@returns {void}
	 */
	render(newElement, options) {
		this.#setRenderPhaseId(G_STATIX_RENDER_PHASE_IDS.RENDER);

		const rootElement = getRootFromOptions(this[G_STATIX_SYMBOL_ELEMENT], options);

		if(isStatixDOM(newElement)) {
			newElement = newElement[G_STATIX_SYMBOL_ELEMENT];
		}

		diff([rootElement], [newElement], rootElement);

		this.#setRenderPhaseId(G_STATIX_RENDER_PHASE_IDS.IDLE);
	}
	/**
	 *	@public
	 *	@method
	 *	@param   {keyof GlobalEventHandlersEventMap} eventType
	 *	@param   {string[]}                          actionNames
	 *	@returns {void}  
	 */
	action(eventType, actionNames) {
		if(this.#metadata.usedEventListenerTypes.has(eventType)) {
			throw new StatixError(`Action with event type "${eventType}" is used!`);
		}

		if(!isString(eventType)) {
			throw new StatixInvalidTypeOrInstance(
				eventType, 
				[G_STATIX_TYPE_NAMES.STRING], 
				"eventType"
			);
		}

		if(!isArray(actionNames)) {
			throw new StatixInvalidTypeOrInstance(
				actionNames, 
				[G_STATIX_TYPE_NAMES.ARRAY], 
				"actionNames"
			);
		}

		this.#addEventTypeToUsedEventListeners(eventType);

		const { 0: statix, 2: signals, 3: actions } = StatixContext.curr();
		const setOfNames = new Set(actionNames);

		this[G_STATIX_SYMBOL_ELEMENT].addEventListener(eventType, function(event) {
			const actionName = event.target.dataset[G_STATIX_JS_DATASET_NAMES.ACTION];

			if(setOfNames.has(actionName)) {
				actions[actionName](statix, signals, event);
			}
		});
	}
	/**
	 * 	@private
	 * 	@method
	 *	@param   {number} phaseId
	 *	@returns {void}
	 */
	#setRenderPhaseId(phaseId) {
		this[G_STATIX_SYMBOL_PHASE_ID] = phaseId;
	}
	/**
	 *	@private
	 *	@method
	 *	@param   {keyof GlobalEventHandlersEventMap} eventType
	 *	@returns {void}
	 */
	#addEventTypeToUsedEventListeners(eventType) {
		this.#metadata.usedEventListenerTypes.add(eventType);
	}
	/**
	 *	@protected
	 *	@method
	 *	@param   {string} phaseId
	 *	@returns {void}
	 */
	[G_STATIX_SYMBOL_SET_PHASE_ID](phaseId) {
		this[G_STATIX_SYMBOL_PHASE_ID] = phaseId;
	}
}

export default StatixElement;