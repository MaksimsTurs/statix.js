export default function protect(target, symbol, value) {
	Object.defineProperty(target, symbol, { configurable: false, enumerable: false, writable: true, value });
};