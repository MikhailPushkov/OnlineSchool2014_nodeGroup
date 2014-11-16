var mongoose = require('mongoose');
var Learner = require('../models/shema_learner');
var fs = require("fs");
var _ = require('underscore');

exports.findById = function (req, res) {
    var id = req.params.id;
    Learner.findOne({ _id: id }, function (err, Learner) {
        if (err) return res.send(404, "Learner not found");
        res.send(Learner);
    });
};


exports.findAll= function (req, res) {

    var _id = req.query.user_id;
    var my_array = [];
    if (_id) {
        Learner.find({ '_id': { $ne: _id } }, function (err, collection) {
            res.send(collection);
        });
        return;
    }

    Learner.find({}, function (err, collection) {
        _.each(collection, function (friend) {
            friend.local = "";
            my_array.push(friend._id.toString());
        });
        res.send(collection);

    });
};

exports.addLearner = function(req, res) {
    var learner = req.body;
    var Learner_model = new Learner(learner);
    Learner_model.save(function (err, new_learner) {
      if (err) return console.error(err);
      res.send(new_learner);
    });
};

exports.updateLearner = function(req, res) {
    var _id = req.params.id;
    var learner = req.body;
    delete learner._id;  /// I need to remove this here, I need to figure out why this is happening, must be a MongoDB configuration
        Learner.findOneAndUpdate({'_id':_id}, learner, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating learner: ' + err);
                res.send(500,{'error':'An error updating learner'});
            } else {
                res.send(learner);
            }
        });
};

exports.deleteLearner = function (req, res) {
    var id = req.params.id;

    Learner.findOneAndRemove({'_id': id }, {safe: true}, function (err, result) {
        if (err) {
            res.send({'error': 'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });
};