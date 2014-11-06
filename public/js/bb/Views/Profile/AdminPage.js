define([
    'App',
    'jquery',
    'marionette',
    'underscore',
    'backbone',
    'handlebars',
    'text!bb/Templates/Profile/admin.html'
],
    function (App, $, Marionette, _, Backbone, Handlebars, Template) {

        var AdminPage = Marionette.View.extend({

            className: "AdminPage",

            template: Handlebars.compile(Template),

            events: { },

            initialize: function (options) {
                this.user_logged_in = App.Session;
                this.listenTo(App, "user_idle", this.is_user_idle);
                this.user_idle = false;
                this.model = App.Profile_in_View;
                this.Interval = null;
                this.childViews = [];      //GARBAGE COLLECTION
                this.view_is_alive = true;
            },

            render: function () {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },
            onClose: function() {
                this.view_is_alive = false;
                if (this.Interval) {
                    clearInterval(this.Interval);
                    this.Interval = null;
                }
                _.each(this.childViews, function (childView) {
                    if (childView.close) {
                        childView.close();
                    }
                });
            }
        });
        return AdminPage;
    });
