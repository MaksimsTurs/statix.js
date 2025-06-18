import createStatix from "./create-statix.js";
import helpers from "./helpers.js";
import { root, tag, fragment } from "./elements.js";

import StatixSignal from "./core/Statix-Signal.core.js";

export {
	root,
	tag,
	fragment
};

export default {
	create: createStatix,
	signal: function(initValue) {
		return new StatixSignal(initValue);	
	},
	helpers
};