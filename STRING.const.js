const G_STATIX_PREFIX = "statix";

export const G_STATIX_RENDER_PHASE_NAMES = {
	0: "Init",
	1: "Idle",
	2: "Mount",
	3: "Unmount",
	4: "Render"
};

export const G_STATIX_HTML_DATASET_NAMES = {
	ID:     `${G_STATIX_PREFIX}-id`,
	BIND:   `${G_STATIX_PREFIX}-bind`,
	ACTION: `${G_STATIX_PREFIX}-action`,
	PLACEHOLDER: `${G_STATIX_PREFIX}-placeholder`
};

export const G_STATIX_JS_DATASET_NAMES = {
	ID:          `${G_STATIX_PREFIX}Id`,
	BIND:        `${G_STATIX_PREFIX}Bind`,
	ACTION:      `${G_STATIX_PREFIX}Action`,
	PLACEHOLDER: `${G_STATIX_PREFIX}Placeholder`
};

export const G_STATIX_TYPE_NAMES = {
	STATIX_ELEMENT: "StatixElement",
	STATIX_DOM:     "StatixDOM",
	STATIX_SIGNAL:  "StatixSignal",
	STRING:         "String",
	ARRAY:          "Array",
	NUMBER:         "Number",
	BOOLEAN:        "Boolean",
	UNDEFINED:      "Undefined",
	NULL:           "Null",
	ANY:            "Any",
	OBJECT:         "Object",
	SYMBOL:         "Symbol",
	FUNCTION:       "Function",
	HTML_ELEMENT:   "HTMLElement",
	HTML_FRAGMENT:  "DocumentFragment",
	HTML_TEXT_NODE: "TextNode",
}