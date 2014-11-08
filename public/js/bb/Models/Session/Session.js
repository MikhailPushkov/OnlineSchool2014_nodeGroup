define([
    'App',
    'jquery',
    'marionette',
    'underscore',
    'backbone',
    'jquery.cookie'
],
    function (App, $, Marionette, _, Backbone, cookie) {

        var Session = Backbone.Model.extend({

            urlRoot: "/user",

            idAttribute: '_id',

            defaults: {
                _id: null,
                role: null,
                itemId: null
            },

            // Loads session information from cookie
            load: function () {
                this.set({
                    _id: $.cookie('_id'),
                    profile_pic: $.cookie('profile_pic'),
                    role: $.cookie('role'),
                    itemId: $.cookie('itemId'),
                    notif_before_last_checked: $.cookie('notif_before_last_checked'),
                    notif_last_checked: $.cookie('notif_last_checked')
                });
            },

            initialize: function () {
                this.load();
            },

            isAuthenticated: function () {
                return this.get("_id");
            },

            clear: function () {
                $.removeCookie('_id');
                $.removeCookie('role');
                $.removeCookie('itemId');
                this.unset("_id", {silent: true});
                this.unset("role", {silent: true});
                this.unset("itemId", {silent: true});
            },

            remove: function (key) {
                $.removeCookie(key);
                this.load();
            },

            setCookie: function (key, value) {
                $.cookie(key, value);
                this.load();
            },

            // Saves Session information to cookie
            save_session: function (result, callback) {
                var d = new Date();
                d.setMinutes(d.getMinutes() + 30);
                result.expiryDate = d;

                this.set({
                    _id: result._id,
                    role: result.role,
                    itemId: result.itemId
                });

                $.cookie('_id', result._id, {expires: result.expiryDate });
                $.cookie('role', result.role, {expires: result.expiryDate });
                $.cookie('itemId', result.itemId, {expires: result.expiryDate });
                if (!callback)return;
                callback();
            }
        });
        // export stuff:
        return Session;
    });