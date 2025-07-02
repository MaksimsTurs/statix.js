import { isArray, isUndefined } from "./is.util.js";

export default function getRootFromOptions(root, options) {
	if(options?.replaceRootWith.selector) {
		return root.querySelector(options.selector);
	} else if(!isUndefined(options?.replaceRootWith.at)) {
		let newRoot = root;

		if(isArray(options.replaceRootWith)) {
			const length = options.at.length;
	
			let index = 0;
	
			while(index < length) {
				newRoot = root.children?.item(options.at[index]);
				index++;
			}
		} else {
			newRoot = root.children.item(options.replaceRootWith.at);
		}

		return newRoot;
	} else {
		return root;
	}
};