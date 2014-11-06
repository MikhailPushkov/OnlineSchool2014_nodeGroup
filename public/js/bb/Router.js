define(['App',
    'jquery',
    'underscore',
    'backbone',
    'bb/Models/Profile/Profile',
    'bb/Views/Header/Header',
    'bb/Views/Login/Login',
    'bb/Views/Signup/Signup',
    'bb/Views/Profile/Wall',
    'bb/Views/Profile/AdminPage'
],
    function (App, $, _, Backbone, Profile, Header, Login, Signup, Wall, AdminPage) {
        // You can access App.Router any where in the application, if you define "App" as a dependency in your modules
        var AppRouter = Backbone.Router.extend({

            initialize: function () {
                this.on('all', function (routeEvent) {
                    $('html, body').animate({ scrollTop: 0 }, 0);  /// scroll to top on every route
                });
                this.routesHit = 0;
                this.history_fragment_array = [];
                this.chat_built = false;
                this.header_built = false;
                //keep count of number of routes handled by your application
                Backbone.history.on('route', this.keep_track_history, this);
            },

            routes: {
                "": "start",
                "login": "login",
                "signup": "signup",
                "admin/:id":"admin",
                "profile/:role/:id": "profile",
                "logout": "logout"
            },

            start: function () {
                var curUserId = App.Session.get("_id");
                if (curUserId) {
                    this.profile(curUserId,AdminPage);
                    return;
                }

                App.mainRegion.show(new Login());
                this.close_unecessary_views();
                this.logout();
            },

            login: function () {
                App.mainRegion.show(new Login());
                this.close_unecessary_views();
                this.logout();
            },

            signup: function () {
                App.mainRegion.show(new Signup());
                this.close_unecessary_views();
                this.logout();
            },

            admin: function (_id) {
                this.fetch_profile(_id, AdminPage);
            },

            profile: function (role ,_id) {
                this.fetch_profile(_id, Wall);
            },

            build_side_bar_and_main_view: function (MainView, options) {
                App.logged_in = true;  /// we sill set this to true here in case there is a refresh, this conditional is just in case the user decides to go back to the login screen
                if (typeof MainView === 'object') {
                    App.mainRegion.show(MainView);  /// view has already been initialized
                } else if (options) {
                    App.mainRegion.show(new MainView(options));
                } else {
                    App.mainRegion.show(new MainView());
                }
                if (!this.header_built) {
                    App.headerRegion.show(new Header());
                    this.header_built = true;
                }
            },

            /*
             This callback is always expecting a profile model
             */
            fetch_profile: function (_id, View) {
                if (App.Profile_in_View && App.Profile_in_View.get("_id") == _id) {
                    this.build_side_bar_and_main_view(View);
                    return;
                }
                var self = this;
                App.Profile_in_View = new Profile({ _id: _id });
                App.Profile_in_View.fetch({
                    success: function () {
                        self.build_side_bar_and_main_view(View);
                        //self.fetch_session_friends();
                        self = null;
                    },
                    error: function (err, resp, options) {
                        App.handle_bad_response(resp);
                    }
                });
            },

            close_unecessary_views: function () {
                try {
                    App.headerRegion.close();
                    this.header_built = false;
                } catch (err) {

                }
                try {
                    App.chatRegion.close();
                } catch (err) {

                }
            },

            keep_track_history: function (e) {
                this.routesHit++;
                this.history_fragment_array.push(Backbone.history.fragment);
            },

            back: function (trigger_change) {
                var trigger;
                var fragment_array_length = this.history_fragment_array.length;
                var last_route = this.history_fragment_array[fragment_array_length - 2];
                if (trigger_change) {
                    trigger = true;
                } else {
                    trigger = false;
                }
                this.navigate(last_route, {
                    trigger: trigger,
                    replace: true
                });
            },

            logout: function () {
                App.Log_User_Out();
            }
        });
        return AppRouter;
    });
