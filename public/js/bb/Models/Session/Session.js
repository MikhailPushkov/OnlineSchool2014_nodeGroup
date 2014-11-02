define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'jquery.cookie'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        cookie
    ) {

        var Session = Backbone.Model.extend({

            urlRoot: "/user",

            idAttribute: '_id',

            defaults: {
                _id: null,
                profile_pic: null,
                role: null,
                itemId:null
            },

            // Loads session information from cookie
            load: function() {
                this.set({
                    _id: $.cookie('_id'),
                    profile_pic: $.cookie('profile_pic'),
                    role: $.cookie('role'),
                    itemId: $.cookie('itemId'),
                    notif_before_last_checked: $.cookie('notif_before_last_checked'),
                    notif_last_checked: $.cookie('notif_last_checked')
                });
            },

            initialize: function() {
                this.load();
            },

            isAuthenticated: function() {
                return this.get("_id");
            },

            clear: function() {
                $.removeCookie('_id');
                $.removeCookie('profile_pic');
                $.removeCookie('role');
                $.removeCookie('itemId');
                this.unset("_id" , {silent: true});
                this.unset("profile_pic", {silent: true});
                this.unset("role", {silent: true});
                this.unset("itemId", {silent: true});
                this.unset("notif_before_last_checked", {silent: true});
                this.unset("notif_last_checked", {silent: true});
            },

            remove: function(key) {
                $.removeCookie(key);
                this.load();
            },

            setCookie: function(key, value) {
                $.cookie(key, value);
                this.load();
            },

            // Saves Session information to cookie
            save_session: function(result, callback) {
                this.set({
                    _id: result._id,
                    profile_pic: result.profile_pic,
                    role: result.role,
                    itemId: result.itemId,
                    notif_before_last_checked: result.notif_before_last_checked,
                    notif_last_checked: result.notif_last_checked
                });                
                $.cookie('_id', result._id);
                $.cookie('profile_pic', result.profile_pic);
                $.cookie('role', result.role);
                $.cookie('itemId', result.itemId);
                $.cookie('notif_before_last_checked', result.notif_before_last_checked);
                $.cookie('notif_last_checked', result.notif_last_checked);
                if(!callback)return;
                callback();
            }
        });
        // export stuff:
        return Session;
    });