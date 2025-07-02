import log from "../utils/log.util.js";

import { 
	isHTMLFragment, 
	
	isUndefined,

	isNodesEqual
} from "../utils/is.util.js";

class StatixDOMPatcher {
	#childsStack = null;
	#currChildsFrame = null;
	
	constructor(oldChilds, newChilds) {
		const newChildsFrame = this.#createChildsFrame(oldChilds, newChilds);

		this.#childsStack = [newChildsFrame];
		this.#currChildsFrame = newChildsFrame;
	}

	patch() {
		let index = 0;

		let patchState = 0;
		
		// Will be replaced with this.#isEndOfTree() function.
		while(index < 30) {
			let currFrameChilds = this.#getCurrFrameChilds();
			
			let oldChilds = currFrameChilds.at(0);
			let newChilds = currFrameChilds.at(1);

			let oldChild = oldChilds[this.#getCurrFrameOldChildsIndex()];
			let newChild = newChilds[this.#getCurrFrameNewChildsIndex()];

			if(isHTMLFragment(newChild)) {
				oldChilds = oldChild.children;
				newChilds = newChild.children;

				oldChild = oldChilds[this.#getCurrFrameOldChildsIndex()];
				newChild = newChilds[this.#getCurrFrameNewChildsIndex()];
				
				this.#childsStack.pop();
				this.#childsStack.push(this.#createChildsFrame(oldChilds, newChilds));
			}

			if(this.#shouldChildsAppended(oldChilds, newChilds)) {
				patchState = 3;
			} else if(this.#shouldElementReplaced(oldChild, newChild)) {
				patchState = 1;
			} else if(this.#shouldElementAttributesChanged(oldChild, newChild)) {
				patchState = 2;
			} else if(this.#shouldGoDeeper(oldChild, newChild)) {
				patchState = 4;
			} else {
				log("END OF TREE");
				log({ NEW_CHILD: newChild, NEW_CHILDS: newChilds });
				log({ OLD_CHILD: oldChild, OLD_CHILDS: oldChilds });
				log({ OLD_INDEX: this.#getCurrFrameOldChildsIndex(), NEW_INDEX: this.#getCurrFrameNewChildsIndex() });
				log({ LENGTH: this.#currChildsFrame.at(-1) });
				log(...this.#childsStack);						
				
				if(this.#getCurrFrameOldChildsIndex() + 1 >= this.#getCurrFrameLength()) {
					this.#childsStack.pop();
				} else {
					this.#incCurrFrameOldChildsIndex();
					this.#incCurrFrameNewChildsIndex();
	
					currFrameChilds = this.#getCurrFrameChilds();
				}

				// This will be removed when i will complete the implemintation of StatixDOMPatcher.
				if(!this.#childsStack.length) {
					return
				}

				continue;
			}

			switch(patchState) {
				case 1:
					log("REPLACE")
					log({ NEW_CHILD: newChild, NEW_CHILDS: newChilds });
					log({ OLD_CHILD: oldChild, OLD_CHILDS: oldChilds });
					log({ OLD_INDEX: this.#getCurrFrameOldChildsIndex(), NEW_INDEX: this.#getCurrFrameNewChildsIndex() });
					log({ LENGTH: this.#currChildsFrame.at(-1) })
					
					oldChild.replaceWith(newChild.cloneNode(true));

					// this.#incCurrFrameNewChildsIndex();
					// this.#incCurrFrameOldChildsIndex();
				break;
				case 2:
					log("UPDATE CHILD ATTRIBUTES");
					log({ NEW_CHILD: newChild, NEW_CHILDS: newChilds });
					log({ OLD_CHILD: oldChild, OLD_CHILDS: oldChilds });
					log({ OLD_INDEX: this.#getCurrFrameOldChildsIndex(), NEW_INDEX: this.#getCurrFrameNewChildsIndex() });
					log({ LENGTH: this.#currChildsFrame.at(-1) })

					this.#updateChildAttributes(oldChild, oldChild.attributes, newChild.attributes);
				break;
				case 3:
					log("APPEND CHILDREN");
					log({ NEW_CHILD: newChild, NEW_CHILDS: newChilds });
					log({ OLD_CHILD: oldChild, OLD_CHILDS: oldChilds });
					log({ OLD_INDEX: this.#getCurrFrameOldChildsIndex(), NEW_INDEX: this.#getCurrFrameNewChildsIndex() });
					log({ LENGTH: this.#currChildsFrame.at(-1) });
					log(...this.#childsStack);

					this.#appendChildrens(oldChild.parentElement, oldChilds, newChilds);
				break;
				case 4:
					log("GO DEEPER");
					log({ NEW_CHILD: newChild, NEW_CHILDS: newChilds });
					log({ OLD_CHILD: oldChild, OLD_CHILDS: oldChilds });
					log({ OLD_INDEX: this.#getCurrFrameOldChildsIndex(), NEW_INDEX: this.#getCurrFrameNewChildsIndex() });
					log({ LENGTH: this.#currChildsFrame.at(-1) })

					const newChildsFrame = this.#createChildsFrame(oldChild.children, newChild.children);
					
					this.#childsStack.push(newChildsFrame);
					this.#currChildsFrame = newChildsFrame;
				break;
			}

			patchState = 0;
			index++;
		}
	}

	#isEndOfTree() {
		return !this.#childsStack.length;
	}

	#incCurrFrameOldChildsIndex() {
		this.#childsStack[this.#childsStack.length - 1][2]++;
	}

	#incCurrFrameNewChildsIndex() {
		this.#childsStack[this.#childsStack.length - 1][3]++;
	}

	#decCurrFrameOldChildsIndex() {
		this.#childsStack[this.#childsStack.length - 1][2]--;
	}

	#decCurrFrameNewChildsIndex() {
		this.#childsStack[this.#childsStack.length - 1][3]--;
	}

	#decCurrFrameOldChildsIndexCount(count) {
		this.#childsStack[this.#childsStack.length - 1][2] -= count;
	}

	#decCurrFrameNewChildsIndexCount(count) {
		this.#childsStack[this.#childsStack.length - 1][3] -= count;
	}

	#getCurrFrameLength() {
		return this.#currChildsFrame.at(4) || 0;
	}

	#getCurrFrameNewChildsIndex() {
		return this.#currChildsFrame.at(3) || 0;
	}

	#getCurrFrameOldChildsIndex() {
		return this.#currChildsFrame.at(2) || 0;
	}

	#getCurrFrameChilds() {
		return [this.#currChildsFrame.at(0), this.#currChildsFrame.at(1)];
	}

	#createChildsFrame(oldChilds, newChilds) {
		const newChildsFrame = [
			oldChilds,
			newChilds,
			// old childs index
			0,
			// new childs index
			0,
			// current index
			(oldChilds.length > newChilds.length ? oldChilds.length : newChilds.length) || 0
		]

		return newChildsFrame;
	}

	#updateChildAttributes(oldChild, oldAttributes, newAttributes) {
		for(let index = 0; index < oldAttributes.length; index++) {
			const name = oldAttributes[index]?.name;
			const currValue = oldAttributes[index]?.value;
			const newValue = newAttributes[name]?.value;
	
			if(isUndefined(newValue)) {
				oldChild.removeAttribute(name);
			} else if(currValue !== newValue) {
				oldChild.setAttribute(name, newValue);
			}	
		}

		for(let index = 0; index < newAttributes.length; index++) {
			const name = newAttributes[index].name;
			const currValue = oldAttributes[name]?.value;
			const newValue = newAttributes[index].value;
		
			if(currValue !== newValue) {
				oldChild.setAttribute(name, newValue);
			}
		}
	}

	#appendChildrens(parent, oldChilds, newChilds) {
		// TODO: Implement Myers Diff Algorithm.
	}

	#shouldGoDeeper(oldChild, newChild) {
		return (oldChild && newChild) && oldChild.children.length && newChild.children.length && !isNodesEqual(oldChild, newChild);
	}

	#shouldChildsAppended(oldChilds, newChilds) {
		return oldChilds && newChilds && newChilds.length > oldChilds.length;
	}

	#shouldElementReplaced(oldChild, newChild) {
		return oldChild && newChild && oldChild.tagName !== newChild.tagName;
	}

	#shouldElementAttributesChanged(oldChild, newChild) {
		if(!oldChild && !newChild) {
			return false;
		}

		if(oldChild.attributes.length !== newChild.attributes.length) {
			return true;
		}
		
		for(let index = 0; index < oldChild.attributes.length; index++) {
			const currName = oldChild.attributes[index].name;
			const currValue = oldChild.attributes[currName].value
			
			if(currValue !== newChild.attributes[currName].value) {
				return true;
			}
		}
		
		return false;
	}
};

export default StatixDOMPatcher;