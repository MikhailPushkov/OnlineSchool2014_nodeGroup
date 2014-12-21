var mongoose = require('mongoose');
var Schedule = require('../models/shema_schedule');
var teacher = require('../models/shema_teacher.js');
var lesson = require('../models/shema_lesson.js');
var fs = require("fs");
var _ = require('underscore');

var deleteSchedulesForClass = function (classid, onsuccess) {
    Schedule.remove({'classId': classid }, function (err, result) {
        if (err) {
            console.error(err);
            return;
        }
        onsuccess();
    });
};

exports.findById = function (req, res) {
    var id = req.params.id;
    schedule.findOne({ _id: id }, function (err, schedule) {
        if (err) return res.send(404, "schedule not found");
        res.send(schedule);
    });
};

exports.findAll = function (req, res) {
    var _id = req.query.user_id;
    var my_array = [];

    if (_id) {
        schedule.find({ '_id': { $ne: _id } }, function (err, collection) {
            res.send(collection);
        });
        return;
    }

    schedule.find({}, function (err, collection) {
        _.each(collection, function (friend) {
            friend.local = "";
            my_array.push(friend._id.toString());
        });
        res.send(collection);
    });
};

exports.addschedules = function (req, res) {
    var schedule = req.body;
    var schedule_model = new Schedule(schedule);
    schedule_model.save(function (err, new_schedule) {
        if (err) return console.error(err);
        res.send(new_schedule);
    });
};

exports.getSchedulesByClass = function (req, res) {
    var classId = req.params.id ;
    if (classId) {
        Schedule.find({ 'classId': classId }, function (err, collection) {
            collection.forEach(function (o, i, arr) {
                o = JSON.parse(JSON.stringify(o));
                teacher.findOne({ _id: o.teacherId }, function (err, teacher) {
                    if (err) return res.send(404, "Teacher not found");

                    o.teacher = JSON.parse(JSON.stringify(teacher));
                    lesson.findOne({ _id: o.lessonId }, function (err, les) {
                        if (err) return res.send(404, "Lesson not found");
                        o.lesson = JSON.parse(JSON.stringify(les));
                        arr[i] = o;
                        if (i == (arr.length - 1)) {
                            res.send(collection);
                        }
                    });
                });
            });
        });
        return;
    };

    Schedule.find({}, function (err, collection) {
        _.each(collection, function (friend) {
            friend.local = "";
            my_array.push(friend._id.toString());
        });
        res.send(collection);
    });
};

exports.addSchedulesForClass = function (req, res) {
    var schedules = req.body.schedules || [];
    var classId = req.body.classId;
    deleteSchedulesForClass(classId, function () {
        schedules.forEach(function (o) {
            var schedule_model = new Schedule(o);
            schedule_model.save(function (err, new_schedule) {
                if (err) return console.error(err);
            });
            res.send("");
        });
    });
};

exports.updateschedule = function (req, res) {
    var _id = req.params.id;
    var schedule = req.body;
    delete schedule._id;  /// I need to remove this here, I need to figure out why this is happening, must be a MongoDB configuration
    schedule.findOneAndUpdate({'_id': _id}, schedule, {safe: true}, function (err, result) {
        if (err) {
            console.log('Error updating schedule: ' + err);
            res.send(500, {'error': 'An error updating schedule'});
        } else {
            res.send(schedule);
        }
    });
};

exports.deleteschedule = function (req, res) {
    var id = req.params.id;

    Teacher.findOneAndRemove({'_id': id }, {safe: true}, function (err, result) {
        if (err) {
            res.send({'error': 'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });
};