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
                "click #pushToServerLearner": "createLearner",
                "mouseenter .table-hover tbody tr": "onSelectRow",
                "click #editButton": "editBtnClick",
                "click #removeButton": "removeBtnClick",
                "click #pushToServerLesson": "createLesson"

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
                this.loadTeacher();
            },

            editBtnClick: function (e) {
                console.log("edit");
            },

            removeBtnClick: function (e) {
                console.log("remove");
                var self = this;

                $.ajax({
                    type: "DELETE",
                    url: "/" + self.selectedTab + '/' + e.currentTarget.parentElement.parentElement.id
                }).done(function (teachers) {
                        console.log("ok");
                        var selTap = self.selectedTab;
                        self["load" + selTap[0].toUpperCase() + selTap.substr(1,selTap.length-1)]();
                    });
            },

            onSelectRow: function (e) {
                $(".itemTool").remove();
                $(e.currentTarget).append("<div class='itemTool'><button id='editButton' class='btn btn-warning'><span class='glyphicon glyphicon glyphicon-edit' aria-hidden='true'></span></button><button id='removeButton' class='btn btn-danger'><span class='glyphicon glyphicon glyphicon-remove' aria-hidden='true'></span></button></div>");
            },

            showError: function (message) {
                $("#error").removeClass("hide").html(message);
            },

            showSucces: function (succes) {
                $("#succes").fadeIn(1);
                $("#succes").removeClass("hide").html(succes);
                $("#succes").fadeOut(5000);
            },


            hideError: function () {
                $("#error").addClass("hide");
            },

            clickTab: function (e) {
                var selectedObjectName = e.currentTarget.parentElement.id.replace("Tab", "");
                this.selectedTab = selectedObjectName;

                this.hideError();
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
                $("#createTableLesson").addClass("hide");
                $("#createBtn").removeClass("hide");

                this.selectedTab = selectedObjectName;
                   switch (this.selectedTab) {
                    case "teacher":
                        this.loadTeacher();
                        break;
                    case "learner":
                        this.loadLearner();
                        break;
                    case "lessons":
                        this.loadLesson();
                        break;
                    default:
                        break;

                }
            },

            showCreateTable: function () {
                $('.createTable').removeClass("hide");
                $('#createBtn').addClass("hide");
            },

            validateTeacher: function () {
                if ($("#firstNameTeacher").val() === "" || $("#lastNameTeacher").val() === "" ||
                    $("#patronymicTeacher").val() === "" ||
                    $("#classTeacher").val() === "" ||
                    $("#phoneTeacher").val() === "" ||
                    $("#emailTeacher").val() === "" ||
                    $("#loginTeacher").val() === "" ||
                    $("#passTeacher").val() === "") {
                    this.showError("Не все поля заполненны.");
                    return false;
                }
                // Остальные проверки записывайте здесь отдельными if-ами
                else if (!/^[А-ЯЁ][а-яё]+$/.test($("#firstNameTeacher").val())) {
                    this.showError("�?мя не должно содержать латинских символов и начинаться с заглавной буквы");
                    return false;
                }
                else if (!/^[А-ЯЁ][а-яё]+$/.test($("#lastNameTeacher").val())) {
                    this.showError("Фамилия не должна содержать латинских символов и начинаться с заглавной буквы");
                    return false;
                }
                else if (!/^[А-ЯЁ][а-яё]+$/.test($("#patronymicTeacher").val())) {
                    this.showError("Отчество не должно содержать латинских символов и начинаться с заглавной буквы");
                    return false;
                }

                else if (!/^8[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/.test($("#phoneTeacher").val())) {
                    this.showError("Не корректно введен телефон.Номер должен начинаться с 8");
                    return false;
                }
                else if (!/.*@[A-Za-z]*\..*/.test($("#emailTeacher").val())) {
                    this.showError("Не корректно введен email");
                    return false;
                }
                else if ($("#loginTeacher").val().length < 6 || $("#loginTeacher").val().length > 20) {
                    this.showError("Не корректно введен логин. Логин должен содержать от 6 до 20 символов");
                    return false;
                }
                else if (!/^\s*(\w+)\s*$/.test($("#passTeacher").val())
                    || $("#passTeacher").val().length > 20
                    || $("#passTeacher").val().length < 6) {
                    this.showError("Не корректно введен пароль.Пароль должен содержать от 6 до 20 латинских букв и цифр");
                    return false;
                }

                else {
                    this.hideError();
                    return true;
                }
            },

            validateLearner: function () {
                if ($("#firstNameLearner").val() === "" ||
                    $("#lastNameLearner").val() === "" ||
                    $("#patronymicLearner").val() === "" ||
                    $("#classLearner").val() === "" ||
                    $("#adressLearner").val() === "" ||
                    $("#loginLearner").val() === "" ||
                    $("#passLearner").val() === "") {
                    this.showError("Не все поля заполненны.");
                    return false;
                }
                // Остальные проверки записывайте здесь отдельными if-ами

                else if (!/^[А-ЯЁ][а-яё]+$/.test($("#firstNameLearner").val())) {
                    this.showError("Имя не должно содержать латинских символов и начинаться с заглавной буквы");
                    return false;
                }
                else if (!/^[А-ЯЁ][а-яё]+$/.test($("#lastNameLearner").val())) {
                    this.showError("Фамилия не должна содержать латинских символов и начинаться с заглавной буквы");
                    return false;
                }
                else if (!/^[А-ЯЁ][а-яё]+$/.test($("#patronymicLearner").val())) {
                    this.showError("Отчество не должно содержать латинских символов и начинаться с заглавной буквы");
                    return false;
                }
                else if (!/^[А-ЯЁа-я1-9.-]/.test($("#adressLearner").val()) || $("#adressLearner").val().length > 50) {
                    this.showError("Адресс должен состоять из букв русского алфавита или цифр");
                    return false;
                }
                else if ($("#loginLearner").val().length < 6 || $("#loginLearner").val().length > 20) {
                    this.showError("Не корректно введен логин. Логин должен содержать от 6 до 20 символов");
                    return false;
                }
                else if (!/^\s*(\w+)\s*$/.test($("#passLearner").val())
                    || $("#passLearner").val().length > 20
                    || $("#passLearner").val().length < 6) {
                    this.showError("Не корректно введен пароль.Пароль должен содержать от 6 до 20 латинских букв и цифр");
                    return false;
                }
                else {
                    this.hideError();
                    return true;
                }
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
            loadTeacher: function () {
                this.clearDataTable();
                $.ajax({
                    type: "GET",
                    url: "/teacher"
                }).done(function (teachers) {
                        teachers.forEach(function (teacher) {
                            var row = "<tr id='" + teacher._id + "'><td>" + teacher.lastName + "</td><td>" + teacher.firstName + "</td><td>" + teacher.patronymic + "</td><td>" + teacher.phone + "</td><td>" + teacher.email + "</tr>";
                            $("#teacherTable tbody").append(row);
                        });
                    });
            },
            loadLesson: function () {
                this.clearDataTable();

                    $.ajax({
                    type: "GET",
                    url: "/lesson"
                }).done(function (lesson) {
                        lesson.forEach(function (lesson) {

                        var row = "<tr id='" + lesson._id + "'><td>" + lesson.lesson + "</td><td>" + lesson.teacherId + "</tr>";
                        $("#lessonTable tbody").append(row);
                    });
                });
            },

            loadLearner: function () {
                this.clearDataTable();
                $.ajax({
                    type: "GET",
                    url: "/learner"
                }).done(function (learner) {
                        learner.forEach(function (learner) {
                            var row = "<tr id='" + learner._id + "'><td>" + learner.lastName + "</td><td>" + learner.firstName + "</td><td>" + learner.patronymic + "</td><td>" + learner.class + "</td><td>" + learner.adress + "</td><td>" + learner.parents + "</tr>";
                            $("#learnerTable tbody").append(row);
                        });
                    });
            },

            clearDataTable: function () {
                $(".itemsTable tbody").empty();
            },

            createTeacher: function () {
                if (!this.validateTeacher())return;
                var self = this;

                var onFail = function (e) {
                    self.showError(e.responseText);
                }
                var onSucces = function (e) {
                    self.showSucces(e);
                }

                var teacher = {
                    "firstName": $("#firstNameTeacher").val(),
                    "lastName": $('#lastNameTeacher').val(),
                    "patronymic": $("#patronymicTeacher").val(),
                    "phone": $("#phoneTeacher").val(),
                    "email": $("#emailTeacher").val()
                };
                $('#createBtn').removeClass("hide");
                $.ajax({
                    type: "POST",
                    url: "/teacher",
                    data: teacher
                }).done(function (response) {
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
                                user.itemId = response._id;
                                $.ajax({
                                    url: '/user/' + user._id,
                                    method: 'PUT',
                                    data: user,
                                    statusCode: {
                                        200: function (e) {
                                            self.loadTeacher();
                                            $('#createTableTeacher').addClass("hide");
                                            $('#createBtn').removeClass("hide");
                                            onSucces("Учитель успешно создан");
                                        },
                                        500: onFail
                                    }
                                })
                            })
                            .fail(onFail);
                    })
                    .fail(onFail);
            },

            createLearner: function () {
                if (!this.validateLearner())return;
                var self = this;
                var onSucces = function (e) {
                    self.showSucces(e);
                }
                var onFail = function (e) {
                    self.showError(e.responseText);
                }
                $('#createBtn').removeClass("hide");
                var learner = {
                    "firstName": $("#firstNameLearner").val(),
                    "lastName": $('#lastNameLearner').val(),
                    "patronymic": $("#patronymicLearner").val(),
                    "class": $("#classLearner").val(),
                    "adress": $("#adressLearner").val(),
                    "parents": ["adsfsadfasf", "asdfasfasdf"]
                };

                $.ajax({
                    type: "POST",
                    url: "/learner",
                    data: learner
                }).done(function (response) {
                        $.ajax({
                            type: "POST",
                            url: "/signup",
                            data: {
                                login: $('#loginLearner').val(),
                                password: $('#passLearner').val()
                            }
                        }).done(function (user) {
                                user.role = 'learner';
                                user.itemId = response._id;
                                 $.ajax({
                                    url: '/user/' + user._id,
                                    method: 'PUT',
                                    data: user,
                                    statusCode: {
                                        200: function (e) {
                                            self.loadLearner();
                                            $('#createTableLearner').addClass("hide");
                                            $('#createBtn').removeClass("hide");
                                            onSucces("Ученик успешно создан");
                                        },
                                        500: onFail
                                    }
                                })
                            })
                            .fail(onFail);
                    })
                    .fail(onFail);
            },


        createLesson: function () {
        // if (!this.validateTeacher())return;
           var self = this;
            var onFail = function (e) {
               self.showError(e.responseText);
           }
            var onSucces = function (e) {
               self.showSucces(e);
            }
            var lesson = {
                "teacherId": $("#TeacherID").val(),
                "lesson": $('#NameLesson').val()

            };
            $('#createBtn').removeClass("hide");
            $.ajax({
                type: "POST",
                url: "/lesson",
                data: lesson,
                statusCode: {
                    200: function (e) {
                        self.loadLesson();
                        $('#createTableLesson').addClass("hide");
                        $('#createBtn').removeClass("hide");
                        onSucces("Предмет успешно создан");
                    },
                    500: onFail
                }
            }).done(function (response) {
                console.log(response);
            })
                ;
        }

          });
        return AdminPage;
    });