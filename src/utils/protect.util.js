import { isSymbol } from "./is.util.js";

import { StatixInvalidTypeOrInstance } from "../core/Statix-Errors.core.js";

import { G_STATIX_TYPE_NAMES } from "../../STRING.const.js";

export default function protect(target, propertySymbol, value) {
	if(!isSymbol(propertySymbol)) {
		throw new StatixInvalidTypeOrInstance(
			propertySymbol,
			[G_STATIX_TYPE_NAMES.SYMBOL],
			"propertySymbol"
		)
	}

	Object.defineProperty(target, propertySymbol, { configurable: false, enumerable: false, writable: true, value });
}