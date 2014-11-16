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

                selectedTab: null,

                events: {
                    "click #pushToServerTeacher": "createTeacher",
                    "click #createBtn": "showCreateTable",
                    "click .tab": "clickTab",
                    "click #pushToServerLearner": "createLearner"
                },

                clickTab: function (e) {
                    var selectedObjectNmae = e.currentTarget.parentElement.id.replace("Tab","");
                    this.selectedTab = selectedObjectNmae;

                    $("#teacherTable").removeClass("active");
                    $("#learnerTable").removeClass("active");
                    $("#classesTable").removeClass("active");
                    $("#lessonsTable").removeClass("active");
                    $("#scheduleTable").removeClass("active");

                    $("#teacherTab").removeClass("active");
                    $("#learnerTab").removeClass("active");
                    $("#classTab").removeClass("active");
                    $("#lessonsTab").removeClass("active");
                    $("#scheduleTab").removeClass("active");

                    $("#" + selectedObjectNmae+"Tab").addClass("active");
                    $("#" + selectedObjectNmae+"Table").addClass("active");

                    this.selectedTab = selectedObjectNmae;
                },

                showCreateTable: function () {
                    $('#createTable').removeClass("hide");
                    $('#createBtn').addClass("hide");
                },

                initialize: function (options) {
                    this.user_logged_in = App.Session;
                    this.listenTo(App, "user_idle", this.is_user_idle);
                    this.user_idle = false;
                    this.model = App.Profile_in_View;
                    this.Interval = null;
                    this.childViews = [];      //GARBAGE COLLECTION
                    this.view_is_alive = true;
                    this.selectedTab = "teacher";
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
            
              FindAllteacher: function(){
                      $.ajax({
                        type: "GET",
                        url: "/teacher"
                    }).done(function(response){
                          function OutputItem (Arr){
               //         console.log(Arr.firstName);
               //         console.log(Arr.lastName);
               //         console.log(Arr.patronymic);
               //         console.log(Arr.email) 
                         console.log(Arr);
                          };
                    response.forEach(OutputItem);
                       
                   });
                },        
                createTeacher: function () {
                    var teacher = {
                        "firstName": $("#firstNameTeacher").val(),
                        "lastName": $('#lastNameTeacher').val(),
                        "patronymic": $("#patronymicTeacher").val(),
                        "email": $("#emailTeacher").val()
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
                                    login: $('#loginTeacher').val(),
                                    password: $('#passTeacher').val()
                                }
                            })
                                .done(function (user) {
                                    user.role = 'teacher';
                                    $.ajax({
                                        url: '/user/' + user._id,
                                        method: 'PUT',
                                        data: user,
                                        statusCode: {
                                            200: function (e) {
                                                console.log('ok');
                                                $('#createTableTeacher').addClass("hide");
                                                $('#createBtn').removeClass("hide");
                                                alert('Учитель успешно создан');
                                            },
                                            500: function (e) {
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
                },
                createLearner: function () {
                    var learner = {
                        "firstName": $("#firstNameLearner").val(),
                        "lastName": $('#lastNameLearner').val(),
                        "patronymic": $("#patronymicLearner").val(),
                        "class": $("#classLearner").val(),
                        "adress": $("#adressLearner").val(),
                        "parents": ["adsfsadfasf","asdfasfasdf"]
                    };
                    console.log(learner);
                    $.ajax({
                        type: "POST",
                        url: "/learner",
                        data: learner
                    }).done(function (response) {
                        console.log(response);
                        $.ajax({
                            type: "POST",
                            url: "/signup",
                            data: {
                                login: $('#loginLearner').val(),
                                password: $('#passLearner').val()
                            }
                        })
                            .done(function (user) {
                                user.role = 'learner';
                                $.ajax({
                                    url     : '/user/'+user._id,
                                    method  : 'PUT',
                                    data    : user,
                                    statusCode : {
                                        200 : function (e){
                                            console.log('ok');
                                            $('#createTableLearner').addClass("hide");
                                            $('#createBtn').removeClass("hide");
                                            alert('Ученик успешно создан');
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
