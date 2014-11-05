var mongoose = require('mongoose');
var Teacher = require('../models/shema_teacher');
var fs = require("fs");
var _ = require('underscore');



exports.Teacher_findById = function(req, res) {
    var id = req.params.id;
    Teacher.findOne({ _id: id }).populate('user').exec(function(err, image) {
        if (err) return res.send(404,"Teacher not found");
         res.send(image);
    });
};

exports.findAll = function(req, res) {
    var teacher_id = req.query.parent_id;
    Teacher.find({'parent': parent_id}).populate('user').exec(function(err, teacher_collection) {
        if (err) return console.error(err);
         res.send(teacher_collection);
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

exports.updateParent = function(req, res) {
    var _id = req.params.id;
    var parent = req.body;
    delete teacher._id;  /// I need to remove this here, I need to figure out why this is happening, must be a MongoDB configuration
        Teacher.findOneAndUpdate({'_id':_id}, parent, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating parent: ' + err);
                res.send(500,{'error':'An error updating parent'});
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