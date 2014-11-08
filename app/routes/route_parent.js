var mongoose = require('mongoose');
var Parent = require('../models/shema_parent');
var Sessions = require('../models/schema_session');
var fs = require("fs");
var _ = require('underscore');



exports.Parent_findById = function (req, res) {
    var id = req.params.id;
    console.log(id);
    Parent.findOne({ _id: id }, function (err, Parent) {
        if (err) return res.send(404, "Parent not found");
        res.send(Parent);
    });
};

exports.Parent_findAll = function (req, res) {
    var _id = req.query.user_id;
    var my_array = [];

    if (_id) {
        Parent.find({ '_id': { $ne: _id } }, function (err, collection) {
            _.each(collection, function (friend) {
                friend.local = "";
                my_array.push(friend._id.toString());
            });
            res.send(collection);
        });
        return;
    }

    Parent.find({}, function (err, collection) {
        _.each(collection, function (friend) {
            friend.local = "";
            my_array.push(friend._id.toString());
        });
        res.send(collection);
    });
};

exports.addParent = function(req, res) {
    var parent = req.body;
    var Parent_model = new Parent(parent);
    Parent_model.save(function (err, new_parent) {
      if (err) return console.error(err);
      res.send(new_parent);
    });
};

exports.updateParent = function(req, res) {
    var _id = req.params.id;
    var parent = req.body;
    delete parent._id;  /// I need to remove this here, I need to figure out why this is happening, must be a MongoDB configuration
        Parent.findOneAndUpdate({'_id':_id}, parent, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating parent: ' + err);
                res.send(500,{'error':'An error updating parent'});
            } else {
                res.send(parent);
            }
        });
};

exports.deleteParent = function (req, res) {
    var id = req.params.id;

    Parent.findOneAndRemove({'_id': id }, {safe: t45rue}, function (err, result) {
        if (err) {
            res.send({'error': 'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });
};