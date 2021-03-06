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

            events: {
                "click #imgOtchet": "showOtchet",
                "click #imgRaspisanie": "showRaspisanie",
                "click #imgKlass": "showKlass",
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
            showOtchet: function () {
                $('#otchet').show();
                $('.buttonContainer').hide();
                $('#backButton').removeClass("hide");
            },
            showKlass: function () {
                $('#klass').show();
                $('.buttonContainer').hide();
                $('#backButton').removeClass("hide");
            },
            showRaspisanie: function () {
                $('#raspisanie').show();
                $('.buttonContainer').hide();
                $('#backButton').removeClass("hide");
            },
            goBack: function () {
                $('#klass').hide();
                $('#raspisanie').hide();
                $('#otchet').hide();
                $('.buttonContainer').show();
                $('#backButton').addClass("hide");
            }
        });
        return Teacher;
    });
