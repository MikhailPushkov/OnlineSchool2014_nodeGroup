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
                var week = ["Понедельник", "Вторник","Среда","Четверг","Пятница", "Суббота"];
                var startTime = ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

                $.ajax({
                    type: "GET",
                    url: "/learner/" + this.model.attributes.itemId
                }).done(function (item) {
                    $.ajax({
                        type: "GET",
                        url: "/schedules/" + item.class
                    }).done(function (schedule) {
                      //  console.log(schedule);
                        $("#dnevnikContainer").empty();
                        for (var wi = 0; wi < week.length; wi++) {
                            $("#dnevnikContainer").append('<table class="dnevnik" style="margin-right:20px;" rules="all"><col width="120" align="center"><col width="150" valign="top"><col width="300"><col width="50" align="center"><col width="50" align="center"><tr><th colspan="100%" align="center">' + week[wi] + '</th></tr><tr align="center"><th>№</th><th>Предмет</th><th>Домашнее задание</th><th>Оценка</th><th>Посещ-ть</th></tr></table>');
                            for (var li = 0; li < startTime.length; li++) {
                                var curLes = {id:0};
                                   schedule.forEach(function (s) {
                                    if (s.weekDay == wi && s.startTime == startTime[li]) {
                                        curLes = s;

                                        $($("#dnevnikContainer .dnevnik")[wi]).append('<tr align="center"><td>' + curLes.startTime + "-" + curLes.endTime + '</td><td>' +  curLes.lesson.lesson +  "" + '</td><td></td><td></td><td></td></tr>');

                                      //  $($("#dnevnikContainer .dnevnik")[wi]).append('<tr align="center"><td>' + curLes.startTime + "-" + curLes.endTime + '</td><td>' +  curLes.lesson.lesson +  "" + '</td><td>стр.10 №5</td><td>4</td><td></td></tr>');
                                    }
                                });
                                if(curLes.id ==0 ) {
                                    $($("#dnevnikContainer .dnevnik")[wi]).append('<tr align="center"><td>' + '</td><td>' + "" + '</td><td>-</td><td></td><td></td></tr>');
                                }//  $($("#dnevnikContainer .dnevnik")[li]).append('<tr align="center"><td>' + curLes ? curLes.startTime : "" + '</td><td>' + curLes ? curLes.lesson.lesson : "" + '</td><td>стр.10 №5</td><td>4</td><td></td></tr>');

                            }
                        }
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
