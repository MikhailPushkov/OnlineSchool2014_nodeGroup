var mongoose = require('mongoose');
var Shedule = require('../models/shema_lesson');
var fs = require("fs");
var _ = require('underscore');



exports.findById = function (req, res) {
    var id = req.params.id;
   Lesson.findOne({ _id: id }, function (err, Lesson) {
        if (err) return res.send(404, "Lesson not found");
        res.send(Lesson);
    });
};

exports.findAll = function (req, res) {
    var _id = req.query.user_id;
    var my_array = [];

    if (_id) {
        Lesson.find({ '_id': { $ne: _id } }, function (err, collection) {
            res.send(collection);
        });
        return;
    }

    Lesson.find({}, function (err, collection) {
        _.each(collection, function (friend) {
            friend.local = "";
            my_array.push(friend._id.toString());
        });
        res.send(collection);
    });
};

exports.addLesson = function(req, res) {
    var lesson = req.body;
    var Lesson_model = new lesson(lesson);
    Lesson_model.save(function (err, new_lesson) {
      if (err) return console.error(err);
      res.send(new_lesson);
    });
};

exports.updateLesson = function(req, res) {
    var _id = req.params.id;
    var lesson = req.body;
    delete lesson._id;  /// I need to remove this here, I need to figure out why this is happening, must be a MongoDB configuration
        Lesson.findOneAndUpdate({'_id':_id}, lesson, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating lesson: ' + err);
                res.send(500,{'error':'An error updating lesson'});
            } else {
                res.send(lesson);
            }
        });
};

exports.deleteLesson = function (req, res) {
    var id = req.params.id;

   Lessons.findOneAndRemove({'_id': id }, {safe: true}, function (err, result) {
        if (err) {
            res.send({'error': 'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });
};