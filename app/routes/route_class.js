var mongoose = require('mongoose');
var Class = require('../models/shema_class');
var fs = require("fs");
var _ = require('underscore');

exports.findById = function (req, res) {
    var id = req.params.id;
    Class.findOne({ _id: id }, function (err, Class) {
        if (err) return res.send(404, "Learner not found");
        res.send(Class);
    });
};


exports.findAll= function (req, res) {

    var _id = req.query.user_id;
    var my_array = [];
    if (_id) {
        Class.find({ '_id': { $ne: _id } }, function (err, collection) {
            res.send(collection);
        });
        return;
    }

    Class.find({}, function (err, collection) {
        _.each(collection, function (friend) {
            friend.local = "";
            my_array.push(friend._id.toString());
        });
        res.send(collection);

    });
};

exports.addClass = function(req, res) {
    var classes = req.body;
    var Class_model = new Class(classes);
    Class_model.save(function (err, new_Class) {
        if (err) return console.error(err);
        res.send(new_Class);
    });
};

exports.updateClass = function(req, res) {
    var _id = req.params.id;
    var classes = req.body;
    delete classes._id;  /// I need to remove this here, I need to figure out why this is happening, must be a MongoDB configuration
    Class.findOneAndUpdate({'_id':_id}, classes, {safe:true}, function(err, result) {
        if (err) {
            console.log('Error updating learner: ' + err);
            res.send(500,{'error':'An error updating learner'});
        } else {
            res.send(classes);
        }
    });
};

exports.deleteClass = function (req, res) {
    var id = req.params.id;

    Class.findOneAndRemove({'_id': id }, {safe: true}, function (err, result) {
        if (err) {
            res.send({'error': 'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });
};