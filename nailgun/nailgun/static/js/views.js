define(
[
    'text!templates/breadcrumb.html',
    'text!templates/add_remove_nodes_dialog.html',
    'text!templates/cluster_list.html',
    'text!templates/cluster_info.html',
    'text!templates/cluster_node.html'
],
function(breadcrumbTemplate, addRemoveNodesDialogTemplate, clusterListTemplate, clusterInfoTemplate, clusterNodeTemplate) {
    var views = {}

    views.Breadcrumb = Backbone.View.extend({
        tagName: 'ul',
        className: 'breadcrumb',
        template: _.template(breadcrumbTemplate),
        path: [],
        setPath: function() {
            this.path = arguments;
            this.render();
        },
        render: function() {
            this.$el.html(this.template({path: this.path}));
            return this;
        }
    });

    views.ClusterInfo = Backbone.View.extend({
        className: 'span12',
        template: _.template(clusterInfoTemplate),
        events: {
            'click .js-add-nodes': 'addRemoveNodes'
        },
        addRemoveNodes: function(e) {
            e.preventDefault();
            var dialog = $(_.template(addRemoveNodesDialogTemplate)({header: 'Test'}));
            dialog.on('hidden', function() {
                $(this).remove();
            });
            dialog.modal();
        },
        initialize: function() {
            this.model.bind('change', this.render, this);
        },
        render: function() {
            this.$el.html(this.template({cluster: this.model}));
            this.$('.node_list').html(new views.ClusterNodeList({model: this.model.get('nodes')}).render().el);
            return this;
        }
    });

    views.ClusterList = Backbone.View.extend({
        className: 'span12',
        template: _.template(clusterListTemplate),
        initialize: function() {
            this.model.bind('reset', this.render, this);
            this.model.bind('add', this.render, this);
        },
        render: function() {
            this.$el.html(this.template({clusters: this.model}));
            return this;
        }
    });

    views.ClusterNode = Backbone.View.extend({
        className: 'span3',
        template: _.template(clusterNodeTemplate),
        initialize: function() {
            this.model.bind('change', this.render, this);
        },
        render: function() {
            this.$el.html(this.template({node: this.model}));
            return this;
        }
    });

    views.ClusterNodeList = Backbone.View.extend({
        className: "row",
        initialize: function() {
            this.model.bind('reset', this.render, this);
            this.model.bind('add', this.render, this);
        },
        render: function() {
            if (this.model.length) {
                this.$el.html('');
                this.model.each(_.bind(function(node) {
                    this.$el.append(new views.ClusterNode({model: node}).render().el);
                }, this));
            } else {
                this.$el.html('<div class="span12"><div class="alert">This cluster has no nodes</div></div>');
            }
            return this;
        }
    });

    return views;
});
