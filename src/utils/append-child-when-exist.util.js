import { isHTMLElement, isStatixDOM, isNull, isUndefined, isString } from "./is.util.js";

import { G_STATIX_SYMBOL_ELEMENT } from "../../SYMBOL.const.js";

export default function appendChildWhenExist(root, child) {
	if(!isNull(child) && !isUndefined(child)) {
		if(isString(child)) {
			const dummy = document.createElement("div");

			dummy.insertAdjacentHTML("afterbegin", child);

			root.appendChild(dummy.childNodes[0]);
		} else if(isStatixDOM(child)) {
			root.appendChild(child[G_STATIX_SYMBOL_ELEMENT]);
		} else if(isHTMLElement(child)) {
			root.appendChild(child);
		}
	}
};