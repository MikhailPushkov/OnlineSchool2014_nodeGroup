define([
    'App',
    'jquery',
    'marionette',
    'underscore',
    'backbone',
    'handlebars',
    'text!bb/Templates/Teacher/Teacher.html'
],
    function (App, $, Marionette, _, Backbone, Handlebars, Template) {

        var Teacher = Marionette.View.extend({

            className: "Teacher",

            template: Handlebars.compile(Template),
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
            }
        });
        return Teacher;
    });
