import STRING_CONST from "../../STRING.const.js";

/***
 *	@param   {HTMLElement} copyFrom
 *	@param   {HTMLElement} copyTo
 *	@returns {void} 
 */
export default function copyAllDelegateEvent(copyFrom, copyTo) {
	const length = STRING_CONST.EVENT_NAMES.length;

	let index = 0;

	while(index < length) {
		copyTo[STRING_CONST.EVENT_NAMES[index]] = copyFrom[STRING_CONST.EVENT_NAMES[index]];

		index++;
	}
};