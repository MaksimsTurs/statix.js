// @ts-check
"use strict"

/**
 *	@template T
 *	@param    {T} object
 *	@returns  {Record<keyof T, keyof T>}
 */
export default function collectKeysInObject(object) {
	/** @type {Record<keyof T, keyof T>} */
	// @ts-ignore
	const keys = {};

	for(let key in object) {
		keys[key] = key;
	}

	return keys;
};