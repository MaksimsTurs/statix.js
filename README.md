# Statix
Statix a lightweight, zero dependencies, written on clean JS, library to give a static HTML websites more interaction!

## Todos
🟥 **Functionality**: Implement a effect functionality for `StatixSignal`.\
🟥 **Performance**: Write custom Myers Diff Algorithm for DOM Patching.\
🟥 **Other**: Write Unit tests.\
🟥 **Other**: Improve Documentation.
🟥 **Other**: Fix ts-ignore hell.

## API Documentation
The core of Statix library consists of 6 classes, 2 of them are some support classes (errors and context) and other 4 are core classes.

### `StatixElement`
This class is responsible for synchronizing the rendering, the rendering itself, such as mounting, unmounting and lifecycles of the element.

`instance.bind` - binding the existing element with the library, trying to call this function multiple times will trigger the error.
The binding is automaticaly executed by creating a statix instance with `statix.create` function.

`instance.unmount` - replaced the element from the DOM with placeholder element, this placeholder element does not affect you web app.\
In the future unmounting the element will trigger the "destroy" functions of effect.

`instance.mount` - replaced the placeholder element with you element.
In the future mounting the element will trigger the call of effect callback functions.

`instance.render` - apply the changes from new DOM to the older DOM. You can change the root element (where the processing starts) with `options.replaceRootWith` option.

`instance.action` - add an event of passed event type to the root element and by trigger the event execute a function that match `data-statix-action` attribute value (this must be a function name).

```js
import statix from "statix.js";

export default statix.create({
	init: function(statix, views, signals, props) {
		// When user click to the root element, and clicked element have the "data-statix-action" attribute with "func_1" value
		// then the "function_1" will be executed.
		// "func_2" will be not executed even if we click on element that has "data-static-action" attribute with the value.
		statix.action("click", ["func_1"]);
		// Initialize the signal value.
		signals.signal_1.init(0)
		// Subscribe all functions on "signal_1" signal.
		signals.signal_1.subscribe(views);
	},
	views: {
		render: function(_, signals) {/* rendering stuff... */}
	},
	actions: {
		func_1: function(statix, signals, event) {},
		func_2: function(statix, signals, event) {}
	},
	signals: {
		signal_1: statix.signal()
	}
});
```

### `StatixDOMBuilder`
This class is responsible to create a DOM nodes and DOM trees.

Before we go to core functionality, we need to speak about three root functions, `root`, `tag` and `fragment`.

`root` - create a shadow copy of the element and use him as "container" for us DOM tree.\
`fragment` - create a document fragment and use him as "container" for us DOM tree, can be used when you need to render only some part of you element.\
`tag` - create a new element.

Properties that you can use:\
`text(text)` - set the text content to the node.\
```js
import { root, tag, fragment } from "statix.js";

root().text("Hello World!");
// or
tag("p").text("Hello World!");
```

`styles(styles)` - set a bunch of styles to the node.\
```js
import { root, tag, fragment } from "statix.js";

root().styles({ color: "blue" });
// or
tag("p").styles({ color: "blue" });
```

`attrs(attributes)` - set a bunch of attributes to the node.\
```js
import { root, tag, fragment } from "statix.js";

root().attrs({ contentEditable: true });
// or
tag("p").attrs({ contentEditable: true });
```

`datasets(datasets)` - set a bunch of dataset attributes to the node.\
```js
import { root, tag, fragment } from "statix.js";

root().datasets({ yourKey: "yourValue" });
// or
tag("p").datasets({ yourKey: "yourValue" });
```

`stxtid(statixId)` - set a statix id dataset attribute, this attribute is not used jet but will be used for rendering optimization in the future.
```js
import { root, tag, fragment } from "statix.js";

root().stxtid(1234);
// or
tag("p").stxtid(1234);
```

`stxtaction(statixActionName)` - set a name of function that will be executed when event listener was triggert on this element.
```js
import { root, tag, fragment } from "statix.js";

root().stxtaction("function_1");
// or
tag("p").stxtaction("function_1");
```

`classes(classes)` - add a bunch of classes to the  node.
```js
import { root, tag, fragment } from "statix.js";

root().classes("first_class second_class");
// or
tag("p").classes("first_class second_class");
```

`child(child)` - append a single child element to the node.
```js
import { root, tag, fragment } from "statix.js";

root().child("Hello World!");
// or
tag("p").child("Hello World!");
// or
fragment().child(tag("p").text("Hello World"));
```

`childs(...childs)` - append a bunch of childs to the node.
```js
import { root, tag, fragment } from "statix.js";

root()
	.childs(
		tag("li")
			.stxtid(9580385093)
			.classes("list_item flex-c-n-n-x")
			.childs(
				tag("p").stxtaction("expandItem").text(item.title).classes("list_item_title"),
				tag("div").classes("list_item_data_container flex-c-n-n-xs").childs(
					tag("div").classes("list_item_property list_item_color flex-r-sb-c-xs").childs(
						tag("p").text("Stufe:"),
						tag("p").styles({ "backgroundColor": item.colorLevel })
					),
					tag("div").classes("list_item_property flex-r-sb-c-xs").childs(
						tag("p").text("Summe:"),
						tag("p").text(item.sum)
					),
					tag("p").text(item.description),
					tag("button").stxtaction("removeItem").stxtid(9580385093).text("Löschen").classes(["list_item_delete_button", "button"])
				)
			)
	);
// or
tag("p").childs("Hello World!", "Some other text");
// or
fragment().childs("Text", tag("p").text("Hello World"));
```

### `StatixSignal`
This class is responsible for reactivity in this library.

`getter value` - returns current state value.
```js
import statix from "statix.js";

export default statix.create({
	init: function(statix, views, signals, props) {
		statix.action("click", ["func_1"]);

		signals.signal_1.init(props.data.xy);
	
		signals.signal_1.subscribe({ func_1: views.func_1 });
	},
	views: {
		render: function(_, signals) {/* rendering stuff... */}
	},
	actions: {
		func_1: function(statix, signals, event) {
			console.log(signals.signal_1.value)
		},
		func_2: function(statix, signals, event) {}
	},
	signals: {
		signal_1: statix.signal()
	}
});
```
`setter value` - set new value and trigger the executions for all subscribers.
```js
import statix from "statix.js";

export default statix.create({
	init: function(statix, views, signals) {
		statix.action("click", ["func_1"]);
	
	signals.signal_1.init(props.data.xy);
	
		signals.signal_1.subscribe({ func_1: views.func_1 });
	},
	views: {
		render: function(_, signals) {/* rendering stuff... */}
	},
	actions: {
		func_1: function(statix, signals, event) {
			signals.signal_1.value = signals.signal_1.value + 1;
			// or
			signals.signal_1.value = (curr) => curr++;
		},
		func_2: function(statix, signals, event) {}
	},
	signals: {
		signal_1: statix.signal()
	}
});
```
`subscribe` - subscribe all provided functions from `views` to the signal, immediately invoke the subscriber.
```js
import statix from "statix.js";

export default statix.create({
	init: function(statix, views, signals) {
		statix.action("click", ["func_1"]);
	
		signals.signal_1.init(props.data.xy);

		signals.signal_1.subscribe({ func_1: views.func_1 });
	},
	views: {
		render: function(_, signals) {/* rendering stuff... */}
	},
	actions: {
		func_1: function(statix, signals, event) {},
		func_2: function(statix, signals, event) {}
	},
	signals: {
		signal_1: statix.signal(0)
	}
});
```
`unsubscribe` - unsubscribe all provided functions.
```js
import statix from "statix.js";

export default statix.create({
	init: function(statix, views, signals) {
		signals.signal_1.unsubscribe({ func_1: views.func_1 });		
	},
	views: {
		render: function(_, signals) {/* rendering stuff... */}
	},
	actions: {
		func_1: function(statix, signals, event) {},
		func_2: function(statix, signals, event) {}
	},
	signals: {
		signal_1: statix.signal(0)
	}
});
```