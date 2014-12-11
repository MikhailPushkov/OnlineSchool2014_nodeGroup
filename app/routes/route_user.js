var mongoose = require('mongoose');
var User = require('../models/shema_user');
var Sessions = require('../models/schema_session');
var fs = require("fs");
var _ = require('underscore');

exports.logOut = function (req, res) {
    console.log("USER LOGOUT ----  user_logged_in");
    var user_id = req.app.get("user_logged_in");
    console.log(user_id);
    Sessions.findOne({ 'user': user_id }, function (err, session) {
        if (err) return res.send(404, "err deleting session");
        try {
            req.logout();
            session.remove();
        } catch (error) {
            res.send(404, "session not found");
        }
        req.session.destroy();
        res.send(200, 'Successfully delete session');
    });
};

exports.findById = function (req, res) {
    var id = req.params.id;
    User.findOne({ _id: id }, function (err, User) {
        if (err) return res.send(404, "User not found");
        res.send(User);
    });
};
exports.findByItemId = function (req, res) {
    var id = req.params.id;
    User.findOne({ itemId: id }, function (err, User) {
        if (err) return res.send(404, "User not found");
        res.send(User);
    });
};

exports.findAll = function (req, res) {
    var _id = req.query.user_id;
    var my_array = [];

    if (_id) {
        User.find({ '_id': { $ne: _id } }, function (err, collection) {
            res.send(collection);
        });
        return;
    }

    User.find({}, function (err, collection) {
        _.each(collection, function (friend) {
            friend.local = "";
            my_array.push(friend._id.toString());
        });
        res.send(collection);
    });
};

exports.addUser = function (req, res) {
    var user = req.body;
    var User_model = new User(user);
    User_model.save(function (err, fluffy) {
        if (err) return console.error(err);
        console.log("User was saved");
    });
};

exports.updateUser = function (req, res) {
    var _id = req.params.id;
    var user = req.body;
    var update_notif = user.update_notif;
    User.findOne({ "_id": _id }, function (err, subject) {
        if (err) return res.send(404, "User not found");
        if (update_notif) {
            subject.set({
                notif_last_checked: Date.now(),
                notif_before_last_checked: user.notif_last_checked
            });
        } else {
            subject.set({
                role: user.role,
                itemId: user.itemId
            });
        }

        // You can only pass one param to the model's save method
        subject.save(function (err, doc, numAffected) {
            console.log(doc);
            if (err) return console.error(err);
            doc.local = "";
            res.send(doc);
        });
    });
};

exports.deleteUser = function (req, res) {
    var id = req.params.id;

    User.findOneAndRemove({'itemId': id }, {safe: true}, function (err, result) {
        if (err) {
            res.send({'error': 'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.send(req.body);
        }
    });
};
