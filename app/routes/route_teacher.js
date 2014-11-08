var mongoose = require('mongoose');
var Teacher = require('../models/shema_teacher');
var fs = require("fs");
var _ = require('underscore');

exports.Teacher_findById = function (req, res) {
    var id = req.params.id;
    console.log(id);
    Teacher.findOne({ _id: id }, function (err, Teacher) {
        if (err) return res.send(404, "Teacher not found");
        res.send(Teacher);
    });
};


exports.Teacher_findAll = function (req, res) {
    var _id = req.query.user_id;
    var my_array = [];

    if (_id) {
        Teacher.find({ '_id': { $ne: _id } }, function (err, collection) {
            _.each(collection, function (friend) {
                friend.local = "";
                my_array.push(friend._id.toString());
            });
            res.send(collection);
        });
        return;
    }

    Teacher.find({}, function (err, collection) {
        _.each(collection, function (friend) {
            friend.local = "";
            my_array.push(friend._id.toString());
        });
        res.send(collection);
    });
};

exports.addTeacher = function(req, res) {
    var teacher = req.body;
    var Teacher_model = new Teacher(teacher);
    Teacher_model.save(function (err, new_teacher) {
      if (err) return console.error(err);
      res.send(new_teacher);
    });
};

exports.updateTeacher = function(req, res) {
    var _id = req.params.id;
    var teacher = req.body;
    delete teacher._id;  /// I need to remove this here, I need to figure out why this is happening, must be a MongoDB configuration
        Teacher.findOneAndUpdate({'_id':_id}, teacher, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating teacher: ' + err);
                res.send(500,{'error':'An error updating teacher'});
            } else {
                res.send(teacher);
            }
        });
};

exports.deleteTeacher = function (req, res) {
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