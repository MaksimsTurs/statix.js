const G_STATIX_CONTEXT = [];

const StatixContext = {
	push: function(context) {
		G_STATIX_CONTEXT.push([
			context?.statix || {}, 
			context?.views || {},	
			context?.signals || {},	
			context?.actions || {},
			context?.views   || {}
		]);
	},
	pop: function() {
		G_STATIX_CONTEXT.pop();
	},
	curr: function() {
		return G_STATIX_CONTEXT[G_STATIX_CONTEXT.length === 0 ? 0 : G_STATIX_CONTEXT.length - 1];
	},
	count: function() {
		return G_STATIX_CONTEXT.length;
	}
};

export default StatixContext;