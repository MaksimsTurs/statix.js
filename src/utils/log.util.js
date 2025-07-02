import { 
	isHTMLElement, 
	isHTMLList, 
	isHTMLCollection,
	isHTMLAttributesMap,

	isObject,
	isArray, 
} from "./is.util.js";

export default function log(text, ...data) {
	const _data = [];
	const length = data.length;

	let index = 0;

	while(index < length) {
		if(isHTMLElement(data[index])) {
			_data.push(data[index].cloneNode(true));
		} else if(isObject(data[index]) && !isHTMLList(data[index]) && !isHTMLCollection(data[index]) && !isHTMLAttributesMap(data[index])) {
			_data.push(structuredClone(data[index]));
		} else if(isArray(data[index])) {
			_data.push(data[index]);
		} else {
			_data.push(data[index]);
		}

		index++;
	}

	console.log(text, ..._data);
}