import { isObject } from "../utils/is.util.js";

import { G_STATIX_RENDER_PHASE_NAMES } from "../../STRING.const.js";

class StatixInvalidTypeOrInstance extends Error {
	/**
	 *	@constructor
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

class StatixTargetInInvalidPhase extends Error {
	constructor(phaseId) {
		super();

		this.message = `Target is in \"${G_STATIX_RENDER_PHASE_NAMES[phaseId]}\" phase!`;
	}
};

class StatixElementIsBinded extends Error {
	constructor() {
		super();

		this.name = "[Statix]";
		this.message = "Statix element is binded!";
	}
};

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