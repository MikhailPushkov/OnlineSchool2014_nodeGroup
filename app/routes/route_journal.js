var mongoose = require('mongoose');
var Homework = require('../models/shema_journal');
var fs = require("fs");
var _ = require('underscore');



exports.findById = function (req, res) {
    var id = req.params.id;
    Journal.findOne({ _id: id }, function (err, journal) {
        if (err) return res.send(404, "journal not found");
        res.send(journal);
    });
};

exports.findAll = function (req, res) {
    var _id = req.query.user_id;
    var my_array = [];

    if (_id) {
        journal.find({ '_id': { $ne: _id } }, function (err, collection) {
            res.send(collection);
        });
        return;
    }

    journal.find({}, function (err, collection) {
        _.each(collection, function (friend) {
            friend.local = "";
            my_array.push(friend._id.toString());
        });
        res.send(collection);
    });
};

exports.addjournal = function(req, res) {
    var journal = req.body;
    var journal_model = new journal(journal);
    journal_model.save(function (err, new_journal) {
      if (err) return console.error(err);
      res.send(new_journal);
    });
};

exports.updatejournal = function(req, res) {
    var _id = req.params.id;
    var journal = req.body;
    delete journal._id;  /// I need to remove this here, I need to figure out why this is happening, must be a MongoDB configuration
        journal.findOneAndUpdate({'_id':_id}, journal, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating journal: ' + err);
                res.send(500,{'error':'An error updating journal'});
            } else {
                res.send(journal);
            }
        });
};

exports.deletejournal = function (req, res) {
    var id = req.params.id;

    journal.findOneAndRemove({'_id': id }, {safe: true}, function (err, result) {
        if (err) {
            res.send({'error': 'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });
};