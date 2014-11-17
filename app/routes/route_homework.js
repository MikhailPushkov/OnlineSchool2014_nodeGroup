var mongoose = require('mongoose');
var Homework = require('../models/shema_homework');
var fs = require("fs");
var _ = require('underscore');



exports.findById = function (req, res) {
    var id = req.params.id;
    Homework.findOne({ _id: id }, function (err, Homework) {
        if (err) return res.send(404, "Homework not found");
        res.send(Homework);
    });
};

exports.findAll = function (req, res) {
    var _id = req.query.user_id;
    var my_array = [];

    if (_id) {
        Homework.find({ '_id': { $ne: _id } }, function (err, collection) {
            res.send(collection);
        });
        return;
    }

    Homework.find({}, function (err, collection) {
        _.each(collection, function (friend) {
            friend.local = "";
            my_array.push(friend._id.toString());
        });
        res.send(collection);
    });
};

exports.addHomework = function(req, res) {
    var homework = req.body;
    var Homework_model = new Homework(homework);
    Homework_model.save(function (err, new_homework) {
      if (err) return console.error(err);
      res.send(new_homework);
    });
};

exports.updateHomework = function(req, res) {
    var _id = req.params.id;
    var homework = req.body;
    delete homework._id;  /// I need to remove this here, I need to figure out why this is happening, must be a MongoDB configuration
        Homework.findOneAndUpdate({'_id':_id}, homework, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating homework: ' + err);
                res.send(500,{'error':'An error updating homework'});
            } else {
                res.send(homework);
            }
        });
};

exports.deleteHomework = function (req, res) {
    var id = req.params.id;

    Homework.findOneAndRemove({'_id': id }, {safe: true}, function (err, result) {
        if (err) {
            res.send({'error': 'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });
};