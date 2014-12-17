define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Learner/Learner.html'
    ],
    function (App, $, Marionette, _, Backbone, Handlebars, Template) {

        var Learner = Marionette.View.extend({

            className: "Learner",

            events: {
                "click #dnevnik": "showDnevnik",
                "click #reting": "showReting",
                "click #backButton": "goBack"
            },
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
            },

            showDnevnik: function () {
                $('#dnevnikPage').show();
                $('.buttonContainer').hide();
            },

            showReting: function () {
                $('#ball').show();
                $('.buttonContainer').hide();
            },

            goBack: function () {
                $('#ball').hide();
                $('#dnevnikPage').hide();
                $('.buttonContainer').show();
            }
        });
        return Learner;
    });
