define([
    'App',
    'jquery',
    'marionette',
    'underscore',
    'backbone',
    'handlebars',
    'text!bb/Templates/Login/Login.html',
    'bb/Models/Session/Session'
],
    function (App, $, Marionette, _, Backbone, Handlebars, Template, Session) {

        var Login = Marionette.View.extend({

            className: "Login",

            template: Handlebars.compile(Template),

            events: {
                "click button": "login",
                "click .profile_wrapper": "login_profile_thumb"
            },

            initialize: function () {

            },

            render: function () {
                $(this.el).html(this.template());
                return this;
            },

            validate: function () {
                var $input_login = $("#login", this.el);
                var $input_password = $("#password", this.el);
                var $alert = $(".alert", this.el);

                if ($input_login.val() === "" && $input_password.val() === "") {
                    $alert.removeClass("hide").html("Введите логин и пароль.");
                } else if ($input_login.val() === "") {
                    $alert.removeClass("hide").html("Введите логин.");
                } else if ($input_password.val() === "") {
                    $alert.removeClass("hide").html("Введите пароль.");
                } else {
                    $alert.addClass("hide");
                    return true;
                }
                return false;
            },

            login: function (e) {
                e.preventDefault();
                if (!this.validate())return;
                var input_login = $("#login", this.el).val();
                input_login = _.escape(input_login);
                var input_password = $("#password", this.el).val();
                input_password = _.escape(input_password);
                var $alert = $(".alert", this.el);
                $.ajax({
                    type: "POST",
                    url: "/login",
                    data: { login: input_login, password: input_password }
                })
                    .done(function (response) {
                        App.Success_Login(response);
                    })
                    .fail(function (xhr) {
                        $alert.removeClass("hide").html(xhr.responseText);
                    });
            },

            login_profile_thumb: function (e) {
                e.preventDefault();
                var input_login = $(e.currentTarget).find('.thumb-container').attr('data-username');
                var input_password = $(e.currentTarget).find('.thumb-container').attr('data-password');
                var $alert = $(".alert", this.el);
                $.ajax({
                    type: "POST",
                    url: "/login",
                    data: { login: input_login, password: input_password }
                })
                    .done(function (response) {
                        App.Success_Login(response);
                    })
                    .fail(function (xhr) {
                        $alert.removeClass("hide").html(xhr.responseText);
                        App.handle_bad_response(xhr);
                    });
            },

            onClose: function () {

            }
        });
        // export stuff:
        return Login;
    });
