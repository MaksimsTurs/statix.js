// @ts-check
"use strict";

/**
 *	@import { 
 *		TStatixElementChild 
 *	} from "../core/Statix-DOM-Builder.core.type.js"; 
 */

import { 
	isHTMLElement, 
	isStatixDOMBuilder,
	isNull, 
	isUndefined, 
	isString 
} from "./is.util.js";

import SYMBOL_CONST from "../../SYMBOL.const.js";

/**
 *	@param {HTMLElement | DocumentFragment} root
 *	@param {TStatixElementChild}            child 
 */
export default function appendChildWhenExist(root, child) {
	if(!isNull(child) && !isUndefined(child)) {
		if(isString(child)) {
			const dummy = document.createElement("div");

			dummy.insertAdjacentHTML("afterbegin", child);

			root.appendChild(dummy.childNodes[0]);
		} else if(isStatixDOMBuilder(child)) {
			root.appendChild(child[SYMBOL_CONST.HTML_ELEMENT]);
		} else if(isHTMLElement(child)) {
			root.appendChild(child);
		}
	}
};