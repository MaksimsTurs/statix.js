// @ts-check
"use strict";

/**
 *	@import {
 *		TStatixElementMetadata,
 *		TStatixElementRenderOptions,
 *		TStatixElementEventNames
 *	} from "./Statix-Element.core.type.js";
 */

import StatixDOMBuilder from "./Statix-DOM-Builder.core.js";
import StatixContext from "./Statix-Context.core.js";

import diff from "../utils/diff.util.js";
import protect from "../utils/protect.util.js";
import getRootFromOptions from "../utils/get-root-from-options.util.js";
import { isStatixDOMBuilder } from "../utils/is.util.js";

import NUMBER_CONST from "../../NUMBER.const.js";
import STRING_CONST from "../../STRING.const.js";
import SYMBOL_CONST from "../../SYMBOL.const.js";

/**
 *  @version     0.0.2
 *	@description Main class responsible for synchronization of rendering, 
 *	life cycles of the element, DOM patching, mounting and unmounting of the element.
 */
class StatixElement {
	/**
	 *	@type {TStatixElementMetadata}
	 */
	#metadata = { placeholder: null, usedEventTypes: new Set() };
	/**
	 *	@constant
	 *	@type {HTMLElement} 
	 */
	// @ts-ignore
	[SYMBOL_CONST.HTML_ELEMENT] = null;
	/**
	 *	@type {number} 
	 */
	// @ts-ignore
	[SYMBOL_CONST.RENDER_PHASE_ID] = null;
	/**
	 *	@param   {number} phaseId
	 *	@returns {void}
	 */
	[SYMBOL_CONST.SET_RENDER_PHASE_ID](phaseId) {
		this[SYMBOL_CONST.RENDER_PHASE_ID] = phaseId;
	}

	constructor() {
		protect(this, SYMBOL_CONST.RENDER_PHASE_ID, NUMBER_CONST.RENDER_PHASE_IDS.INIT);
		protect(this, SYMBOL_CONST.HTML_ELEMENT, null);
	}
	/**
	 *	@param   {string} statixBindValue
	 *	@returns {void}
	 */
	bind(statixBindValue) {
		this.#setRenderPhaseId(NUMBER_CONST.RENDER_PHASE_IDS.MOUNT);

		const maybeExistedElement = document.querySelector(`[data-${STRING_CONST.HTML_DATASET_NAMES.BIND}="${statixBindValue}"]`);
		const placeholder = document.createComment(statixBindValue);
		
		// @ts-ignore
		this[SYMBOL_CONST.HTML_ELEMENT] = maybeExistedElement;
		this.#metadata.placeholder = placeholder;
		
		this.#setRenderPhaseId(NUMBER_CONST.RENDER_PHASE_IDS.IDLE);
	}
	/**
	 *	@returns {void} 
	 */
	mount() {
		if(!this.#isMounted()) {
			this.#setRenderPhaseId(NUMBER_CONST.RENDER_PHASE_IDS.MOUNT);

			// @ts-ignore
			this.#metadata.placeholder?.replaceWith(this[SYMBOL_CONST.HTML_ELEMENT]);

			this.#setRenderPhaseId(NUMBER_CONST.RENDER_PHASE_IDS.IDLE);
		}
	}
	/**
	 *	@returns {void} 
	 */
	unmount() {
		if(this.#isMounted()) {
			this.#setRenderPhaseId(NUMBER_CONST.RENDER_PHASE_IDS.UNMOUNT);
			
			// @ts-ignore
			this[SYMBOL_CONST.HTML_ELEMENT].replaceWith(this.#metadata.placeholder);

			this.#setRenderPhaseId(NUMBER_CONST.RENDER_PHASE_IDS.IDLE);
		}
	}
	/**
	 *	@param   {HTMLElement | DocumentFragment | StatixDOMBuilder} newElement
	 *	@param   {TStatixElementRenderOptions}                       [options]
	 *	@returns {void}
	 */
	render(newElement, options) {
		this.#setRenderPhaseId(NUMBER_CONST.RENDER_PHASE_IDS.RENDER);

		const rootElement = getRootFromOptions(this[SYMBOL_CONST.HTML_ELEMENT], options);

		if(isStatixDOMBuilder(newElement)) {
			newElement = newElement[SYMBOL_CONST.HTML_ELEMENT];
		}

		diff([rootElement], [newElement], rootElement);

		this.#setRenderPhaseId(NUMBER_CONST.RENDER_PHASE_IDS.IDLE);
	}
	/**
	 *	@param   {keyof GlobalEventHandlersEventMap} eventType
	 *	@param   {string[]}                          actionNames
	 *	@returns {void}  
	 */
	action(eventType, actionNames) {
		this.#metadata.usedEventTypes.add(eventType);

		const contextData = StatixContext.current();
		const setOfNames = new Set(actionNames);

		// @ts-ignore
		this[SYMBOL_CONST.HTML_ELEMENT].addEventListener(eventType, function(event) {
			const actionName = event.target.dataset[STRING_CONST.STATIX_JS_DATASET_NAMES.ACTION];

			if(setOfNames.has(actionName)) {
				if(contextData?.actions) {
					contextData.actions[actionName]({
						args: function(context) {
							return [context.statix, context.signals, event]
						}
					});
				}
			}
		});
	}
	/**
	 *	@returns {boolean} 
	 */
	#isMounted() {
		// @ts-ignore
		return !!this[SYMBOL_CONST.HTML_ELEMENT].parentElement;
	}
	/**
	 *	@param   {number} phaseId
	 *	@returns {void}
	 */
	#setRenderPhaseId(phaseId) {
		this[SYMBOL_CONST.RENDER_PHASE_ID] = phaseId;
	}
}

export default StatixElement;