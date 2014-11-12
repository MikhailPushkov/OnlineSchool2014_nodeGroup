define([
    'App',
    'jquery',
    'marionette',
    'underscore',
    'backbone',
    'handlebars',
    'text!bb/Templates/Admin/admin.html'
],
    function (App, $, Marionette, _, Backbone, Handlebars, Template) {

        var AdminPage = Marionette.View.extend({

                className: "Admin",

                template: Handlebars.compile(Template),

                events: {"click #create": "create"},

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
                },
                create: function () {
                    var teacher = {
                        "firstName": $("#firstName").val(),
                        "lastName": $('#lastName').val(),
                        "patronymic": $("#patronymic").val(),
                        "email": $("#email").val()
                    };

                    $.ajax({
                        type: "POST",
                        url: "/teacher",
                        data: teacher
                    }).done(function (response) {
                            console.log(response);
                            $.ajax({
                                type: "POST",
                                url: "/signup",
                                data: {
                                    login: $('#login').val(),
                                    password: $('#pass').val()
                                }
                            })
                                .done(function (user) {
                                    user.role = 'teacher';
                                    $.ajax({
                                        url     : '/user/'+user._id,
                                        method  : 'PUT',
                                        data    : user,
                                        statusCode : {
                                            200 : function (e){
                                                console.log('ok');
                                            },
                                            500 : function (e){
                                                console.log(e);
                                            }
                                        }
                                    })
                                    // console.log('ok');
                                    // App.Success_SignUp(response);
                                })
                                .fail(function (xhr) {
                                   // console.log(xhr);
                                   // $alert.removeClass("hide").html(xhr.responseText);
                                });
                        })
                        .fail(function (xhr) {
                            $alert.removeClass("hide").html(xhr.responseText);
                        });
                }
            })
            ;
        return AdminPage;
    })
;
