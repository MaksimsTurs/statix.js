// @ts-check
"use strict";

import { isObject } from "../utils/is.util.js";

import STRING_CONST from "../../STRING.const.js";

/**
 *	@version 0.0.2 
 */
class StatixInvalidTypeOrInstance extends Error {
	/**
	 *	@param {any}      whatever
	 *	@param {string[]} mustBeTypes
	 *	@param {string}   were 
	 */
	constructor(whatever, mustBeTypes, were) {
		super();

		let mustBeTypesText = "";
		let index = 0;

		const length = mustBeTypes.length;

		while(index < length) {
			mustBeTypesText += `${mustBeTypes[index]}${(index + 1) === length ? "" : " | "}`;			
			index++;
		}

		if(whatever?.constructor.name) {
			whatever = whatever.constructor.name;
		} else if(isObject(whatever)) {
			whatever = whatever.toString().replace(/\[object (.*)\]/, "$1");
		}

		this.message = `"${were}" must be type of or instance of ${mustBeTypesText} but is ${whatever}!`;
	}
};

/**
 *	@version 0.0.2 
 */
class StatixTargetInInvalidPhase extends Error {
	constructor(phaseId) {
		super();

		this.message = `Target is in \"${STRING_CONST.RENDER_PHASE_NAMES[phaseId]}\" phase!`;
	}
};

/**
 *	@version 0.0.2 
 */
class StatixElementIsBinded extends Error {
	constructor() {
		super();

		this.name = "[Statix]";
		this.message = "Statix element is binded!";
	}
};

/**
 *	@version 0.0.2 
 */
class StatixError extends Error {
	/**
	 *	@param {string} message 
	 */
	constructor(message) {
		super();

		this.message = message;
	}
};

export { 
	StatixInvalidTypeOrInstance,
	StatixTargetInInvalidPhase,
	StatixElementIsBinded,
	StatixError
};