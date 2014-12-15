var mongoose = require('mongoose');
var lessonOfTeacher = require('../models/shema_lessonOfTeacher');
var fs = require("fs");
var _ = require('underscore');



exports.findById = function (req, res) {
    var id = req.params.id;
    lessonOfTeacher.findOne({ _id: id }, function (err, lessonOfTeacher) {
        if (err) return res.send(404, "lessonOfTeacher not found");
        res.send(lessonOfTeacher);
    });
};

exports.findAll = function (req, res) {
    var _id = req.query.user_id;
    var my_array = [];

    if (_id) {
        lessonOfTeacher.find({ '_id': { $ne: _id } }, function (err, collection) {
            res.send(collection);
        });
        return;
    }

    lessonOfTeacher.find({}, function (err, collection) {
        _.each(collection, function (friend) {
            friend.local = "";
            my_array.push(friend._id.toString());
        });
        res.send(collection);
    });
};

exports.addlessonOfTeacher = function(req, res) {
    var lessonOfTeacher = req.body;
    var lessonOfTeacher_model = new lessonOfTeacher(lessonOfTeacher);
    lessonOfTeacher_model.save(function (err, new_lessonOfTeacher) {
      if (err) return console.error(err);
      res.send(new_lessonOfTeacher);
    });
};

exports.updatelessonOfTeacher = function(req, res) {
    var _id = req.params.id;
    var lessonOfTeacher = req.body;
    delete lessonOfTeacher._id;  /// I need to remove this here, I need to figure out why this is happening, must be a MongoDB configuration
        lessonOfTeacher.findOneAndUpdate({'_id':_id}, lessonOfTeacher, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating lessonOfTeacher: ' + err);
                res.send(500,{'error':'An error updating lessonOfTeacher'});
            } else {
                res.send(lessonOfTeacher);
            }
        });
};

exports.deletelessonOfTeacher = function (req, res) {
    var id = req.params.id;

    lessonOfTeacher.findOneAndRemove({'_id': id }, {safe: true}, function (err, result) {
        if (err) {
            res.send({'error': 'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });
};