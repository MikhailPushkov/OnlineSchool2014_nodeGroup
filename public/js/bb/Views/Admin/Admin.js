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
                "click #pushToServerLesson": "createLesson",
                "click #pushToServerClass": "createClass",
                "click .lessonDrp": "lessonDropdownClick",
                "click #classDrp": "dropdownClickClass",
                "click #classList .itemDropMenu": "classDropdownClick",

                "click .teacherDrp": "teacherDropdownClick",
                "click #scheduleContent a": "showScheduleModal",
                "click #saveBtn": "saveSchedule"
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
//====== scedule start=====
            lessonDropdownClick: function (e) {
                this.dropdownClick("lessonsList", e);
            },
            teacherDropdownClick: function (e) {
                this.dropdownClick("teachersList", e);
            },

            dropdownClick: function (listSelector, e) {
                var curTarget = e.currentTarget;
                $("#teachersList").hide();
                $("#lessonsList").hide();
                var btn = $(curTarget);
                var menu = $('#' + listSelector);
                var pos = btn.offset();
                var modalPos = $("#modalWithSchedule .modal-dialog").offset();
                var top = pos.top + btn.height() - modalPos.top;
                var left = pos.left - modalPos.left;
                menu.css("left", left);
                menu.css("top", top);
                menu.show();

                var itemsMenu = $('#' + listSelector + " .itemDropMenu");
                itemsMenu.off('click', window.__onselectscheduleitem);
                window.__onselectscheduleitem = function (e) {
                    var text = $(e.currentTarget.firstChild).html();
                    $(btn.find('span')[0]).html(text);
                    btn.attr("id", e.currentTarget.id);
                    itemsMenu.off('click', window.__onselectscheduleitem);
                }

                itemsMenu.on('click', window.__onselectscheduleitem);

                var hide = function () {
                    $('#' + listSelector).hide();
                    document.removeEventListener('click', hide, false);
                };

                document.addEventListener('click', hide, false);
                e.stopPropagation();
            },

            showScheduleModal: function (e) {
                $('#lessonDrp,#teacherDrp').attr("id", "").find('button').removeClass('btn-danger').find('span').html('-');
                $('button.btn-danger');
                var startTime = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
                window.__editClass = e.currentTarget.id;
                $.ajax({
                    type: "GET",
                    url: "/schedules/" + window.__editClass
                }).done(function (schedules) {
                    schedules.forEach(function (obj, i, arr) {
                        var rowNum = startTime.indexOf(obj.startTime);
                        var view = $($(".modal-body tbody tr")[rowNum]);
                        $($(view.find('.lessonDrp')[obj.weekDay]).attr("id", obj.lessonId).find('span')[0]).html(obj.lesson.lesson);
                        $($(view.find('.teacherDrp')[obj.weekDay]).attr("id", obj.teacherId).find('span')[0]).html(obj.teacher.lastName + " " + obj.teacher.firstName[0].toUpperCase() + "." + obj.teacher.patronymic[0].toUpperCase() + ".");
                    });
                });
                $.ajax({
                    type: "GET",
                    url: "/lesson"
                }).done(function (lessons) {
                    var list = $("#lessonsList").empty();
                    var row = '<li class="itemDropMenu" id="" role="presentation"><a role="menuitem" tabindex="-1">-</a></li>';
                    list.append(row);
                    lessons.forEach(function (lesson) {
                        var row = '<li class="itemDropMenu" id="' + lesson._id + '" role="presentation"><a role="menuitem" tabindex="-1">' + lesson.lesson + '</a></li>';
                        list.append(row);
                    });
                });
                $.ajax({
                    type: "GET",
                    url: "/teacher"
                }).done(function (teachers) {
                    var list = $("#teachersList").empty();
                    var row = '<li id="" class="itemDropMenu" role="presentation"><a role="menuitem" tabindex="-1">-</a></li>';
                    list.append(row);
                    teachers.forEach(function (teacher) {
                        var row = '<li id="' + teacher._id + '" class="itemDropMenu" role="presentation"><a role="menuitem" tabindex="-1">' + teacher.lastName + " " + teacher.firstName[0].toUpperCase() + "." + teacher.patronymic[0].toUpperCase() + "." + '</a></li>';
                        list.append(row);
                    });
                });
            },

            saveSchedule: function (e) {
                var self = this;
                var error = false;
                var startTime = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
                var endTime = ['8:45', '9:45', '10:45', '11:45', '12:45', '13:45', '14:45', '15:45'];
                var rows = $('.modal-body tbody tr');
                var items = [];

                for (var i = 0; i < startTime.length; i++) {
                    var row = $(rows[i]);
                    var lessons = row.find('.lessonDrp');
                    var teachers = row.find('.teacherDrp');
                    for (var j = 0; j < lessons.length; j++) {
                        var item = {
                            "startTime": startTime[i],
                            "endTime": endTime[i],
                            "classId": window.__editClass,
                            "weekDay": j,
                            "room": null,
                            "lessonId": lessons[j].id,
                            "teacherId": teachers[j].id
                        }

                        if (item.lessonId && item.teacherId) {
                            items.push(item);
                        } else if (item.lessonId != item.teacherId) {
                            item.lessonId ? $(teachers[j]).find("button").addClass("btn-danger") : $(lessons[j]).find("button").addClass("btn-danger");
                            error = true;
                        }
                    }
                }
                if (error) return;
                $.ajax({
                    type: "POST",
                    url: "/schedules",
                    data: {
                        schedules: items,
                        classId: window.__editClass
                    }
                }).done(function () {
                    $('button.close').click();
                    self.showSucces("Рассписание успешно изменено.")
                });
            },
//====== scedule end =====
            dropdownClickClass: function (listSelector, e) {
                $.ajax({
                    type: "GET",
                    url: "/class"
                }).done(function (classes) {
                    var list = $("#classList").empty();
                    var row = '<li class="itemDropMenu" id="" role="presentation"><a role="menuitem" tabindex="-1">-</a></li>';
                    list.append(row);
                    classes.forEach(function (classes) {
                        var row = '<li class="itemDropMenu" id="' + classes._id + '"role="presentation"><a role="menuitem" tabindex="-1">' + classes.nameClass + '</a></li>';
                        list.append(row);
                    });
                });
            },

            classDropdownClick: function (e) {
                var el = e.currentTarget;
                $($('#classDrp').attr("_id", el.id).find('span')[0]).html($(e.currentTarget).find('a').html());
            },

            editBtnClick: function (e) {
                var self = this;
                $.ajax({
                    type: "GET",
                    url: "/" + self.selectedTab + '/' + e.currentTarget.parentElement.parentElement.id
                }).done(function (item) {

                    if (self.selectedTab === "teacher" || self.selectedTab === "learner") {
                        $.ajax({
                            type: "GET",
                            url: "/userItem/" + e.currentTarget.parentElement.parentElement.id
                        }).done(function (user) {
                            item.login = user.local.login;
                            item.password = user.local.password;
                            var selTap = self.selectedTab;
                            self["edit" + selTap[0].toUpperCase() + selTap.substr(1, selTap.length - 1)](item);
                        });
                    } else {
                        var selTap = self.selectedTab;
                        self["edit" + selTap[0].toUpperCase() + selTap.substr(1, selTap.length - 1)](item);
                    }
                });
            },

            removeBtnClick: function (e) {
                var self = this;
                $.ajax({
                    type: "DELETE",
                    url: "/" + self.selectedTab + '/' + e.currentTarget.parentElement.parentElement.id
                }).done(function () {
                    $.ajax({
                        type: "DELETE",
                        url: "/user" + '/' + e.currentTarget.parentElement.parentElement.id
                    }).done(function () {
                    });

                    var selTap = self.selectedTab;
                    self["load" + selTap[0].toUpperCase() + selTap.substr(1, selTap.length - 1)]();
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
                $("#succes").removeClass("hide").fadeIn(500).html(succes).fadeOut(3000);
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
                $("#classTabContent").removeClass("active");
                $("#lessonTabContent").removeClass("active");
                $("#scheduleTabContent").removeClass("active");

                $("#teacherTab").removeClass("active");
                $("#learnerTab").removeClass("active");
                $("#classTab").removeClass("active");
                $("#lessonTab").removeClass("active");
                $("#scheduleTab").removeClass("active");

                $("#" + selectedObjectName + "Tab").addClass("active");
                $("#" + selectedObjectName + "TabContent").addClass("active");
                $("#createTableTeacher").addClass("hide");
                $("#createTableLearner").addClass("hide");
                $("#createTableLesson").addClass("hide");
                $("#createTableClass").addClass("hide");
                $("#createBtn").removeClass("hide");
                this.selectedTab = selectedObjectName;
                switch (this.selectedTab) {
                    case "teacher":
                        this.loadTeacher();
                        break;
                    case "learner":
                        this.loadLearner();
                        break;
                    case "lesson":
                        this.loadLesson();
                        break;
                    case "class":
                        this.loadClass();
                        break;
                    case "schedule":
                        $("#createBtn").addClass("hide");
                        this.loadSchedule();
                    default:
                        break;
                }
            },

            showCreateTable: function () {
                $('.createTable').removeClass("hide");
                $('#createBtn').addClass("hide");
                this.editId = null;
            },

            validateTeacher: function () {
                var oldpass = $("#passTeacher").val();
                if ($("#firstNameTeacher").val() === "" || $("#lastNameTeacher").val() === "" ||
                    $("#patronymicTeacher").val() === "" ||
                    $("#classTeacher").val() === "" ||
                    $("#phoneTeacher").val() === "" ||
                    $("#emailTeacher").val() === "" ||
                    (( $("#loginTeacher").val() === "" || $("#passTeacher").val() === "") && !this.editId)) {
                    this.showError("Не все поля заполненны.");
                    return false;
                }
                // Остальные проверки записывайте здесь отдельными if-ами
                if (!/^[А-ЯЁ][а-яё]+$/.test($("#firstNameTeacher").val())) {
                    this.showError("Имя должно содержать русские буквы и начинаться с заглавной буквы");
                    return false;
                }
                if (!/^[А-ЯЁ][а-яё]+$/.test($("#lastNameTeacher").val())) {
                    this.showError("Фамилия должна содержать русские буквы и начинаться с заглавной буквы");
                    return false;
                }
                if (!/^[А-ЯЁ][а-яё]+$/.test($("#patronymicTeacher").val())) {
                    this.showError("Отчество должно содержать русские буквы и начинаться с заглавной буквы");
                    return false;
                }

                if (!/^8[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]$/.test($("#phoneTeacher").val())) {
                    this.showError("Не корректно введен телефон. Номер должен состоять из 11 цифр, Номер должен начинаться с 8");
                    return false;
                }
                if (!/.*@[A-Za-z]*\..*/.test($("#emailTeacher").val())) {
                    this.showError("Не корректно введен email");
                    return false;
                }
                if ($("#loginTeacher").val().length < 6 || $("#loginTeacher").val().length > 20) {
                    this.showError("Не корректно введен логин. Логин должен содержать от 6 до 20 символов");
                    return false;
                }
                if (this.pass != oldpass && (!/^\s*(\w+)\s*$/.test($("#passTeacher").val())
                    || $("#passTeacher").val().length > 20
                    || $("#passTeacher").val().length < 6)) {
                    this.showError("Не корректно введен пароль.Пароль должен содержать от 6 до 20 латинских букв и цифр");
                    return false;
                }


                this.hideError();
                return true;
            },
            validateLearner: function () {
                var oldpass = $("#passLearner").val();
                if ($("#firstNameLearner").val() === "" ||
                    $("#lastNameLearner").val() === "" ||
                    $("#patronymicLearner").val() === "" ||
                    $("#classLearner").val() === "" ||
                    $("#adressLearner").val() === "" ||
                    (( $("#loginLearner").val() === "" || $("#passLearner").val() === "") && !this.editId)) {
                    this.showError("Не все поля заполненны.");
                    return false;
                }
                // Остальные проверки записывайте здесь отдельными if-ами

                if (!/^[А-ЯЁ][а-яё]+$/.test($("#firstNameLearner").val())) {
                    this.showError("Имя должно содержать русские буквы и начинаться с заглавной буквы");
                    return false;
                }
                if (!/^[А-ЯЁ][а-яё]+$/.test($("#lastNameLearner").val())) {
                    this.showError("Фамилия должно содержать русские буквы и начинаться с заглавной буквы");
                    return false;
                }
                if (!/^[А-ЯЁ][а-яё]+$/.test($("#patronymicLearner").val())) {
                    this.showError("Отчество должно содержать русские буквы и начинаться с заглавной буквы");
                    return false;
                }
                if (!/^[А-ЯЁа-я1-9.-]/.test($("#adressLearner").val()) || $("#adressLearner").val().length > 50) {
                    this.showError("Адресс должен состоять из букв русского алфавита или цифр и не должен превышать 50 символов");
                    return false;
                }
                if ($("#loginLearner").val().length < 6 || $("#loginLearner").val().length > 20) {
                    this.showError("Не корректно введен логин. Логин должен содержать от 6 до 20 символов");
                    return false;
                }
                if (this.pass != oldpass && ( !/^\s*(\w+)\s*$/.test($("#passLearner").val())
                    || $("#passLearner").val().length > 20
                    || $("#passLearner").val().length < 6)) {
                    this.showError("Не корректно введен пароль.Пароль должен содержать от 6 до 20 латинских букв и цифр");
                    return false;
                }
                this.hideError();
                return true;
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

                        var row = "<tr id='" + lesson._id + "'><td>" + lesson.lesson + "</tr>";
                        $("#lessonTable tbody").append(row);
                    });
                });
            },
            loadClass: function () {
                this.clearDataTable();
                $.ajax({
                    type: "GET",
                    url: "/class"
                }).done(function (classes) {
                    classes.forEach(function (classes) {
                        var row = "<tr id='" + classes._id + "'><td>" + classes.nameClass + "</td><td>" + classes.teacherID + "</tr>";
                        $("#classTable tbody").append(row);
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

                        $.ajax({
                            type: "GET",
                            url: "/class/" + learner.class
                        }).done(function (classes) {
                            learner.class = classes.nameClass;

                            var row = "<tr id='" + learner._id + "'><td>" + learner.lastName + "</td><td>" + learner.firstName + "</td><td>" + learner.patronymic + "</td><td>" + learner.class + "</td><td>" + learner.adress + "</td><td>" + learner.parents + "</tr>";
                            $("#learnerTable tbody").append(row);
                        });

                    });
                });
            },
            loadSchedule: function () {
                $.ajax({
                    type: "GET",
                    url: "/class"
                }).done(function (classes) {
                    $("#scheduleContent").empty();
                    classes.forEach(function (c) {
                        var row = '<a id="' + c._id + '" data-toggle="modal" data-target="#modalWithSchedule" class="list-group-item">' + c.nameClass + '</a>';
                        $("#scheduleContent").append(row);
                    });
                });
            },

            clearDataTable: function () {
                $(".itemsTable tbody").empty();
            },

            editTeacher: function (teacher) {
                this.showCreateTable();
                $('#loginTeacher').val(teacher.login);
                $('#passTeacher').val(teacher.password);
                $("#firstNameTeacher").val(teacher.firstName);
                $('#lastNameTeacher').val(teacher.lastName);
                $("#patronymicTeacher").val(teacher.patronymic);
                $("#phoneTeacher").val(teacher.phone);
                $("#emailTeacher").val(teacher.email);
                this.pass = teacher.password;
                this.editId = teacher._id;
                /* $.ajax({
                 type: "PUT",
                 url: "/teacher/id="+ teacher.id,
                 data: teacher
                 }).done(function (response) {
                 update();
                 }).fail(onFail);*/
            },
            editLearner: function (learner) {
                this.showCreateTable();
                $('#loginLearner').val(learner.login);
                $('#passLearner').val(learner.password);
                $("#firstNameLearner").val(learner.firstName);
                $('#lastNameLearner').val(learner.lastName);
                $("#patronymicLearner").val(learner.patronymic);
                $("#classLearner").val(learner.class);
                $("#parentLearner").val(learner.parents);
                $("#adressLearner").val(learner.adress);
                this.editId = learner._id;
                this.pass = learner.password;
            },
            editLesson: function (lesson) {
                this.showCreateTable();
                $('#NameLesson').val(lesson.lesson);
                this.editId = lesson._id;
            },
            editClass: function (classes) {
                this.showCreateTable();
                $('#nameClass').val(classes.nameClass);
                $('#teacherId').val(classes.teacherID);
                this.editId = classes._id;
            },
            createTeacher: function () {
                var oldpass = $("#passTeacher").val();
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
                if (this.editId) {
                    var itemId = this.editId;
                    $.ajax({
                        type: "PUT",
                        url: "/teacher/" + this.editId,
                        data: teacher,
                        statusCode: {
                            200: function (e) {
                                self.loadTeacher();
                                $('#createBtn').removeClass("hide");
                                $('#createTableTeacher').addClass("hide");
                                onSucces("Учитель успешно изменен");
                            },
                            500: onFail
                        }
                    }).done(function (response) {
                        var pass = self.pass;
                        var user = {  login: $('#loginTeacher').val(),
                            password: $('#passTeacher').val()
                        };
                        if (pass == oldpass) {
                            var local = {  login: $('#loginTeacher').val()
                            };
                            $.ajax({

                                type: "PUT",
                                url: "/userItem/" + itemId,
                                data: local,
                                statusCode: {
                                    200: function (e) {
                                    },
                                    500: onFail
                                }
                            })
                        }
                        else {
                            $.ajax({
                                type: "DELETE",
                                url: "/user" + '/' + itemId
                            }).done(function () {
                                $.ajax({
                                    type: "POST",
                                    url: "/signup",
                                    data: user
                                })
                                    .done(function (user) {
                                        user.role = 'teacher';
                                        user.itemId = itemId;
                                        $.ajax({
                                            url: '/user/' + user._id,
                                            method: 'PUT',
                                            data: user,
                                            statusCode: {
                                                200: function (e) {
                                                },
                                                500: onFail
                                            }
                                        })
                                    })
                                    .fail(onFail);
                            });
                        }
                    })
                        .fail(onFail);
                    this.editId = null;
                } else {
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
                                            $('#createBtn').removeClass("hide");
                                            $('#createTableTeacher').addClass("hide");
                                            onSucces("Учитель успешно создан");
                                        },
                                        500: onFail
                                    }
                                })
                            })
                            .fail(onFail);
                    })
                        .fail(onFail);
                }
            },
            createLearner: function () {
                var oldpass = $("#passLearner").val();
                if (!this.validateLearner())return;
                var self = this;
                var onSucces = function (e) {
                    self.showSucces(e);
                }
                var onFail = function (e) {
                    self.showError(e.responseText);
                }
                var learner = {
                    "firstName": $("#firstNameLearner").val(),
                    "lastName": $('#lastNameLearner').val(),
                    "patronymic": $("#patronymicLearner").val(),
                    "class": $("#classDrp").attr("_id"),
                    "adress": $("#adressLearner").val(),
                    "parents": $("#parentLearner").val()
                };
                if (this.editId) {
                    var itemId = this.editId;
                    $.ajax({
                        type: "PUT",
                        url: "/learner/" + this.editId,
                        data: learner,
                        statusCode: {
                            200: function (e) {
                                self.loadTeacher();
                                $('#createBtn').removeClass("hide");
                                $('#createTableLearner').addClass("hide");
                                onSucces("Ученик успешно изменен");
                            },
                            500: onFail
                        }
                    }).done(function (response) {
                        var pass = self.pass;
                        var user = {  login: $('#loginLearner').val(),
                            password: $('#passLearner').val()
                        };
                        if (pass == oldpass) {
                            var local = {  login: $('#loginLearner').val()
                            };
                            $.ajax({

                                type: "PUT",
                                url: "/userItem/" + itemId,
                                data: local,
                                statusCode: {
                                    200: function (e) {
                                    },
                                    500: onFail
                                }
                            })
                        }
                        else {
                            $.ajax({
                                type: "DELETE",
                                url: "/user" + '/' + itemId
                            }).done(function () {
                                $.ajax({
                                    type: "POST",
                                    url: "/signup",
                                    data: user
                                })
                                    .done(function (user) {
                                        user.role = 'learner';
                                        user.itemId = itemId;
                                        $.ajax({
                                            url: '/user/' + user._id,
                                            method: 'PUT',
                                            data: user,
                                            statusCode: {
                                                200: function (e) {
                                                },
                                                500: onFail
                                            }
                                        })
                                    })
                                    .fail(onFail);
                            });
                        }
                    })
                        .fail(onFail);
                    this.loadLearner();
                    this.editId = null;
                }
                else {
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
                                        $('#createBtn').removeClass("hide");
                                        $('#createTableLearner').addClass("hide");
                                        onSucces("Ученик успешно создан");
                                    },
                                    500: onFail
                                }
                            })
                        })
                            .fail(onFail);
                    })
                        .fail(onFail);
                }
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
                    "lesson": $('#NameLesson').val()
                };
                if (this.editId) {
                    $.ajax({
                        type: "PUT",
                        url: "/lesson/" + this.editId,
                        data: lesson,
                        statusCode: {
                            200: function (e) {
                                self.loadLesson();
                                $('#createBtn').removeClass("hide");
                                $('#createTableLesson').addClass("hide");
                                onSucces("Предмет успешно изменен");
                            },
                            500: onFail
                        }
                    }).done(function (response) {
                    })
                        .fail(onFail);
                    this.editId = null;
                }
                else {
                    $.ajax({
                        type: "POST",
                        url: "/lesson",
                        data: lesson,
                        statusCode: {
                            200: function (e) {
                                self.loadLesson();
                                $('#createBtn').removeClass("hide");
                                $('#createTableLesson').addClass("hide");
                                onSucces("Предмет успешно создан");
                            },
                            500: onFail
                        }
                    }).done(function (response) {
                    });
                }
            },
            createClass: function () {
                // if (!this.validateTeacher())return;
                var self = this;
                var onFail = function (e) {
                    self.showError(e.responseText);
                }
                var onSucces = function (e) {
                    self.showSucces(e);
                }
                var classes = {
                    "nameClass": $('#nameClass').val(),
                    "teacherID": $('#teacherId').val()
                };
                if (this.editId) {
                    $.ajax({
                        type: "PUT",
                        url: "/class/" + this.editId,
                        data: classes,
                        statusCode: {
                            200: function (e) {
                                //  self.loadTeacher();
                                $('#createBtn').removeClass("hide");
                                $('#createTableClass').addClass("hide");
                                onSucces("Классный руководитель успешно изменен");
                            },
                            500: onFail
                        }
                    }).done(function (response) {
                    })
                        .fail(onFail);
                    this.loadClass();
                    this.editId = null;
                }
                else {
                    $.ajax({
                        type: "POST",
                        url: "/class",
                        data: classes,
                        statusCode: {
                            200: function (e) {
                                self.loadClass();
                                $('#createBtn').removeClass("hide");
                                $('#createTableClass').addClass("hide");
                                onSucces("Классный руководитель успешно создан");
                            },
                            500: onFail
                        }
                    }).done(function (response) {
                    });
                }
            }

        });
        return AdminPage;
    });