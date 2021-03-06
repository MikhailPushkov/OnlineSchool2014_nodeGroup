define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Header/Header.html'
    ],
    function (App, $, Marionette, _, Backbone, Handlebars, Template) {

        var Header = Marionette.View.extend({

            className: "Header",

            template: Handlebars.compile(Template),

            initialize: function () {
                this.model = App.Session;
                this.listenTo(App, "user_idle", this.is_user_idle);
                this.user_idle = false;
                this.Interval = null;
                this.view_is_alive = true;
                this.childViews = [];      //GARBAGE COLLECTION
                this.warning_is_up = false;
                self.collec_legth = 0;
                this.listenTo(this.model, "change:profile_pic", this.render);
            },

            events: {
                "click #logout": "logout"
            },

            render: function () {
                $(this.el).html(this.template());
                this.loadHeader(this.model.attributes.itemId, this.model.attributes.role);
                //$(this.el).html(this.template(this.model.toJSON()));
                return this;
            },

            logout: function () {
                App.Log_User_Out();
            },

            loadHeader: function (id, role) {
                var self = this;
                if( role == "admin") return;
                $.ajax({
                    type: "GET",
                    url: "/" + role + "/" + id
                }).done(function (item) {
                    $(self.el).find('#fio').removeClass("hide").html(item.lastName+" "+item.firstName +" "+ item.patronymic );
                    if (role == 'teacher'){
                        $(self.el).find('#role').removeClass("hide").html("Учитель");
                        $(self.el).find('#imgFoto').removeClass("hide");
                        return;
                    }

                    if (role == 'learner'){
                        $.ajax({
                            type: "GET",
                            url: "/class/" + item.class
                        }).done(function (classes) {
                            $(self.el).find('#class').removeClass("hide").html(classes.nameClass);
                        });

                        $(self.el).find('#role').removeClass("hide").html("Ученик");
                        $(self.el).find('#imgFoto').removeClass("hide");
                        return;
                    }
                });
            },

            onClose: function () {
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
        // export stuff:
        return Header;
    });
