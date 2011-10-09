Controller = function(options) {
	this.router = new Backbone.Router();
	_.each(this.routes, function(handler, route) {
		this.router.route(route, handler, _.bind(this[handler], this));
	}, this);
	Backbone.View.apply(this, arguments);
	Backbone.history.start({pushState: true});
};

_.extend(Controller.prototype, Backbone.View.prototype);
Controller.extend = Backbone.View.extend;

RenderedView = function(options) {
	options = _.extend({}, options);
	if(! options.model) {
		options.model = new RenderedModel({
			id: options.id
		},{
			urlRoot: this.urlRoot
		});
	}
	Backbone.View.apply(this, arguments);
	this.model.bind('change', this.render, this);
	this.model.bind('all', function(e) {
		console.log(e);
	});

	if($(this.el).is(':empty')) {
		this.fetch();	
	}
};

_.extend(RenderedView.prototype, Backbone.View.prototype, {
	fetch: function() {
		return this.model.fetch({dataType: 'html'});
	},
	render: function() {
		return $(this.el).html(this.model.get('html'));
	}
});
RenderedView.extend = Backbone.View.extend;

RenderedModel = Backbone.Model.extend({
	initialize: function(attributes, options) {
		this.urlRoot = options.urlRoot;
	},
	parse: function(resp, xhr) {
		if(typeof resp === 'string') {
			return {html:resp};
		} else {
			return resp;
		}
	}
});

ViewManager = function(container) {
	this.container = $(container);
};

_.extend(ViewManager.prototype, {
	show: function(view, options) {
		if(this.view) {
			this.view.remove();
		} else if(! this.container.is(':empty')) {
			var el = this.container.children(':first');
		}
		this.view = new view(_.extend({el: el}, options));
		if(! el) {
			this.container.html(this.view.el);
		}
	}
});