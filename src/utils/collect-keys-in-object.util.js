export default function collectKeysInObject(object) {
	const keys = {};

	for(let key in object) {
		keys[key] = key;
	}

	return keys;
};