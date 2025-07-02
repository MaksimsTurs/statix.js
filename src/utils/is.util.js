import StatixElement from "../core/Statix-Element.core.js";
import StatixDOMBuilder from "../core/Statix-DOM-Builder.core.js"
import StatixSignal from "../core/Statix-Signal.core.js";

export const isBoolean = (maybeBoolean) => typeof maybeBoolean === "boolean";
export const isString = (maybeString) => typeof maybeString === "string";
export const isArray = (maybeArray) => Array.isArray(maybeArray);
export const isFunction = (maybeFunction) => typeof maybeFunction === "function";
export const isNull = (maybeNull) => maybeNull === null;
export const isObject = (maybeObject) => typeof maybeObject === "object" && !isArray(maybeObject) && !isNull(maybeObject);
export const isUndefined = (maybeUndefined) => maybeUndefined === undefined;
export const isSymbol = (maybeSymbol) => maybeSymbol.constructor.name === "Symbol";

export const isHTMLFragment = (maybeFragment) => maybeFragment instanceof DocumentFragment;
export const isHTMLElement = (maybeHTMLElement) => maybeHTMLElement instanceof HTMLElement;
export const isHTMLList = (maybeNodeList) => maybeNodeList instanceof NodeList;
export const isHTMLText = (maybeTextNode) => (maybeTextNode && maybeTextNode.nodeType) === Node.TEXT_NODE;
export const isHTMLCollection = (maybeHTMLCollection) => maybeHTMLCollection instanceof HTMLCollection;
export const isHTMLAttributesMap = (maybeHTMLAttributesMap) => maybeHTMLAttributesMap instanceof NamedNodeMap;

export const isStatixDOMBuilder = (maybeStatixDOMBuilder) => maybeStatixDOMBuilder instanceof StatixDOMBuilder;
export const isStatixElement = (maybeStatixElement) => maybeStatixElement instanceof StatixElement;
export const isStatixSignal = (maybeStatixSignal) => maybeStatixSignal instanceof StatixSignal;

export const isInObject = (key, object) => Object.hasOwn(object, key);

export const isNodesEqual = (firstNode, secondNode) => firstNode?.isEqualNode(secondNode);