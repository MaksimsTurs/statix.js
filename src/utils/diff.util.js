import { isHTMLText, isHTMLFragment, isUndefined, isString } from "./is.util.js";

const getLengthFromChildNodes = (oldChilds, newChilds) => oldChilds?.length > newChilds?.length ? oldChilds?.length : newChilds?.length;

const shouldElementCompletelyReplaced = (oldChild, newChild) => !isUndefined(oldChild) && !isUndefined(newChild) && oldChild.tagName !== newChild.tagName;

const shouldElementAttributesChanged = (oldAttributes, newAttributes) => (!isUndefined(oldAttributes) && !isUndefined(newAttributes)) && !areAttributesEqual(oldAttributes, newAttributes);

const shouldTextNodeChanged = (oldNode, newNode) => (isHTMLText(oldNode) && isHTMLText(newNode)) && oldNode.textContent !== newNode.textContent;

const shouldElementsAppended = (oldChild, newChild) => isUndefined(oldChild) && !isUndefined(newChild);

const shouldGoDeeper = (oldChild, newChild, newChilds) => !(isHTMLText(oldChild) && isHTMLText(newChild)) && oldChild && newChilds?.length && !oldChild?.isEqualNode(newChild);

const shouldElementsRemoved = (oldChilds, newChilds) => (oldChilds?.length - newChilds?.length > 0);

function removeChilds(oldChilds, newChilds) {
	let childsCount = oldChilds.length - newChilds.length;
	
	while(childsCount-- > 0) {
		oldChilds[0].remove();
	}
};

function areAttributesEqual(oldAttributes, newAttributes) {
	if(oldAttributes.length !== newAttributes.length) {
		return false;
	}

	let index = 0;
	
	const length = oldAttributes.length;
	
	while(index < length) {
		if(oldAttributes[index].value !== newAttributes[oldAttributes[index].name].value) {
			return false;
		}

		index++;
	}

	return true;
};

function appendAllChildren(oldChilds, newChilds, parent) {
	const fragment = document.createDocumentFragment();
	const oldChildsLength = oldChilds.length;
	const count = newChilds.length - oldChildsLength;

	let index = 0;

	while(index < count) {
		if(isString(newChilds[oldChildsLength])) {
			fragment.append(newChilds[oldChildsLength]);
		} else {
			fragment.appendChild(newChilds[oldChildsLength]);
		}

		index++;
	}

	parent.appendChild(fragment);

	return index;
};

function applyElementAttributesChange(firstDOM, secondDOM) {
	const currElementAttributes = firstDOM.attributes;
	const newElementAttributes = secondDOM.attributes;

	{
		let index = 0;

		const length = currElementAttributes.length;
		
		while(index < length) {
			const name = currElementAttributes[index].name;
			const currValue = currElementAttributes[index].value;
			const newValue = newElementAttributes[name]?.value;

			if(isUndefined(newValue)) {
				firstDOM.removeAttribute(name);
			} else if(currValue !== newValue) {
				firstDOM.setAttribute(name, newValue);
			}	

			index++;
		}
	}

	{
		let index = 0;

		const length = newElementAttributes.length;

		while(index < length) {
			const name = newElementAttributes[index].name;
			const currValue = currElementAttributes[name]?.value;
			const newValue = newElementAttributes[index].value;
		
			if(currValue !== newValue) {
				firstDOM.setAttribute(name, newValue);
			}

			index++;
		}
	}
};

export default function diff(oldChilds, newChilds, parent) {
	if(shouldElementsRemoved(oldChilds, newChilds)) {
		removeChilds(oldChilds, newChilds);
	}

	let indexes = { old: 0, new: 0 };
	
	const length = getLengthFromChildNodes(oldChilds, newChilds);

	while(indexes.old < length) {
		let oldChild = oldChilds[indexes.old];
		let newChild = newChilds[indexes.new];

		if(isHTMLFragment(newChild)) {
			newChilds = newChild.childNodes;
			newChild = newChilds[0];

			oldChilds = oldChild.childNodes;
			oldChild = oldChilds[0];

			indexes = { old: 0, new: 0 };
		}
		
		if(shouldElementCompletelyReplaced(oldChild, newChild)) {
			oldChild.replaceWith(newChild);
			indexes.new--;
		} else if(shouldTextNodeChanged(oldChild, newChild)) {
			oldChild.replaceWith(newChild);
			indexes.new--;
		} else if(shouldElementAttributesChanged(oldChild?.attributes, newChild?.attributes)) {
			applyElementAttributesChange(oldChild, newChild);
		}
					
		if(shouldElementsAppended(oldChild, newChild)) {
			indexes.old += appendAllChildren(oldChilds, newChilds, parent);
		}

		if(shouldGoDeeper(oldChild, newChild, newChilds)) {
			diff(oldChild?.childNodes, newChild?.childNodes, oldChild);
		}
		
		indexes.new++;
		indexes.old++;
	}

	return indexes.old;
};