var mongoose = require('mongoose');
var Class = require('../models/shema_class');
var fs = require("fs");
var _ = require('underscore');



exports.Class_findById = function(req, res) {
    var id = req.params.id;
    console.log(id);
    Class.findOne({_id: id }, function(err, clazz) {
                    if (err) return res.send(404,"Class not found");
         res.send(clazz);
    });
};

exports.findAll = function (req, res) {
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
    var clazz = req.body;
    var Class_model = new Class(clazz);
    Class_model.save(function (err, new_class) {
      if (err) return console.error(err);
      res.send(new_class);
    });
};

exports.updateClass = function(req, res) {
    var _id = req.params.id;
    var clazz = req.body;
    delete clazz._id;  /// I need to remove this here, I need to figure out why this is happening, must be a MongoDB configuration
        Class.findOneAndUpdate({'_id':_id}, clazz, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating class: ' + err);
                res.send(500,{'error':'An error updating class'});
            } else {
                res.send(clazz);
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