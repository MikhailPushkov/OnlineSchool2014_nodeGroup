var mongoose = require('mongoose');
var Schedule = require('../models/shema_schedule');
var fs = require("fs");
var _ = require('underscore');


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


exports.addschedule = function(req, res) {
    var schedule = req.body;
    var schedule_model = new schedule(schedule);
    schedule_model.save(function (err, new_schedule) {
        if (err) return console.error(err);
        res.send(new_schedule);
    });
};

exports.updateschedule = function(req, res) {
    var _id = req.params.id;
    var schedule = req.body;
    delete schedule._id;  /// I need to remove this here, I need to figure out why this is happening, must be a MongoDB configuration
    schedule.findOneAndUpdate({'_id':_id}, schedule, {safe:true}, function(err, result) {
        if (err) {
            console.log('Error updating schedule: ' + err);
            res.send(500,{'error':'An error updating schedule'});
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