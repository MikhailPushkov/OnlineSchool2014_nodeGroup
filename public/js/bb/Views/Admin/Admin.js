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

                initialize: function (options) {
                    this.user_logged_in = App.Session;
                    this.listenTo(App, "user_idle", this.is_user_idle);
                    this.user_idle = false;
                    this.model = App.Profile_in_View;
                    this.Interval = null;
                    this.childViews = [];      //GARBAGE COLLECTION
                    this.view_is_alive = true;
                    this.selectedTab = "teacher";

                    this.clearDataTable();
                    this.loadTeachers();
                },
                clickTab: function (e) {
                    var selectedObjectName = e.currentTarget.parentElement.id.replace("Tab", "");
                    this.selectedTab = selectedObjectName;

                    $("#teacherTabContent").removeClass("active");
                    $("#learnerTabContent").removeClass("active");
                    $("#classesTabContent").removeClass("active");
                    $("#lessonsTabContent").removeClass("active");
                    $("#scheduleTabContent").removeClass("active");

                    $("#teacherTab").removeClass("active");
                    $("#learnerTab").removeClass("active");
                    $("#classTab").removeClass("active");
                    $("#lessonsTab").removeClass("active");
                    $("#scheduleTab").removeClass("active");

                    $("#" + selectedObjectName + "Tab").addClass("active");
                    $("#" + selectedObjectName + "TabContent").addClass("active");
                    $("#createTableTeacher").addClass("hide");
                    $("#createTableLearner").addClass("hide");
                    $("#createBtn").removeClass("hide");

                    this.selectedTab = selectedObjectName;

                    switch (this.selectedTab) {
                        case "teacher":
                            this.clearDataTable();
                            this.loadTeachers();
                             $(".alert").addClass("hide");
                            break;
                        case "learner":
                            this.clearDataTableLearner();
                            this.loadLearner();
                            $(".alert").addClass("hide");
                            break;
                        default:
                            break;
                                          }
                },

                showCreateTable: function () {
                    $('.createTable').removeClass("hide");

                },

                validateTeacher: function () {
                    var $alert = $(".alert", this.el);
                    var $error = $("#ErrorTeacher",this.el);
                    if ($("#firstNameTeacher").val() === "" ||   $("#lastNameTeacher").val() === ""  ||
                        $("#patronymicTeacher").val() === "" ||
                        $("#classTeacher").val() === ""||
                        $("#adressTeacher").val() === "" ||
                        $("#loginTeacher").val() === "" ||
                        $("#pasTteacher").val() === "" ) {
                        $error.removeClass("hide");
                        $alert.removeClass("hide").html("Заполните все поля");}
                    else {
                            $alert.addClass("hide");
                            return true;
                        }
                    return false;
                },

                validateLearner: function () {
                    var $alert = $(".alert", this.el);
                    var $error = $("#ErrorLearner",this.el);
                    if ($("#firstNameLearner").val() === "" ||   $("#lastNameLearner").val() === ""  ||
                        $("#patronymicLearner").val() === "" ||
                        $("#classLearner").val() === ""||
                        $("#adressLearner").val() === "" ||
                        $("#loginLearner").val() === "" ||
                        $("#passLearner").val() === "" ) {
                        $error.removeClass("hide");
                        $alert.removeClass("hide").html("Заполните все поля")}
                    else {
                            $alert.addClass("hide");
                            return true;
                        }

                    return false;
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
                loadTeachers: function () {

                    $.ajax({
                        type: "GET",
                        url: "/teacher"
                    }).done(function (teachers) {
                            teachers.forEach(function(teacher){
                                var row = "<tr><td>" + teacher.lastName + "</td><td>"+teacher.firstName+"</td><td>"+ teacher.patronymic + "</td><td>"+ teacher.email + "</tr>" ;
                                $("#teacherTable tbody").append(row);
                            });
                        });
                },
                loadLearner: function () {
                    $.ajax({
                        type: "GET",
                        url: "/learner"
                    }).done(function (learner) {
                        learner.forEach(function(learner){
                            var row = "<tr><td>" + learner.lastName + "</td><td>"+learner.firstName+"</td><td>"+ learner.patronymic + "</td><td>"+ learner.class + "</td><td>"+ learner.adress+"</td><td>"+ learner.parents+"</tr>" ;
                            $("#learnerTable tbody").append(row);
                        });
                    });
                },

                clearDataTableLearner: function(){
                    $("#learnerTable tbody").empty();
                },

                clearDataTable: function(){
                    $("#teacherTable tbody").empty();
                },

                createTeacher: function () {
                    if (!this.validateTeacher())return;
                    var teacher = {
                        "firstName": $("#firstNameTeacher").val(),
                        "lastName": $('#lastNameTeacher').val(),
                        "patronymic": $("#patronymicTeacher").val(),
                        "email": $("#emailTeacher").val()
                    };
                    var self = this;
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
                                                self.clearDataTable();
                                                self.loadTeachers();
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
                    if (!this.validateLearner())return;
                    var learner = {
                        "firstName": $("#firstNameLearner").val(),
                        "lastName": $('#lastNameLearner').val(),
                        "patronymic": $("#patronymicLearner").val(),
                        "class": $("#classLearner").val(),
                        "adress": $("#adressLearner").val(),
                        "parents": ["adsfsadfasf", "asdfasfasdf"]
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
                                        url: '/user/' + user._id,
                                        method: 'PUT',
                                        data: user,
                                        statusCode: {
                                            200: function (e) {
                                                console.log('ok');
                                                $('#createTableLearner').addClass("hide");
                                                $('#createBtn').removeClass("hide");
                                                alert('Ученик успешно создан');
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
                }

            })
            ;
        return AdminPage;
    })
;
