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
                $.ajax({
                    type: "GET",
                    url: "/learner/" + this.model.attributes.itemId
                }).done(function (item) {
                    $.ajax({
                        type: "GET",
                        url: "/schedules/" + item.class
                    }).done(function (schedule) {


                        schedule.forEach(function (schedule) {


                        });


                    });
                });


                $('#dnevnikPage').show();
                $('.buttonContainer').hide();
                $('#backButton').removeClass("hide");


            },

            showReting: function () {
                $('#ball').show();
                $('.buttonContainer').hide();
                $('#backButton').removeClass("hide");
            },

            goBack: function () {
                $('#ball').hide();
                $('#dnevnikPage').hide();
                $('.buttonContainer').show();
                $('#backButton').addClass("hide");
            }

        });
        return Learner;
    });
