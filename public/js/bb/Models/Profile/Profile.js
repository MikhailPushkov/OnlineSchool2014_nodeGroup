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

        var Profile = Backbone.Model.extend({

            urlRoot: "/user",

            idAttribute: "_id",

            defaults: {
                profile_pic: null,
                role: null,
                itemId: null,
                match: false
            },

            initialize: function () {
            }
        });
        return Profile;
    });
