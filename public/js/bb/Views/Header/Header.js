define([
        'App',
        'jquery',
        'marionette',
        'underscore',
        'backbone',
        'handlebars',
        'text!bb/Templates/Header/Header.html'
    ],
    function(
        App,
        $,
        Marionette,
        _,
        Backbone,
        Handlebars,
        Template
    ) {

        var Header = Marionette.View.extend({

            className: "Header",

            template: Handlebars.compile(Template),

            initialize: function() {
                this.model = App.Session;
                this.listenTo(App, "user_idle", this.is_user_idle);
                this.user_idle = false;
                this.Interval = null;
                this.view_is_alive = true;
                this.childViews = [];      //GARBAGE COLLECTION
                this.warning_is_up = false;
                self.collec_legth = 0;
                this.listenTo(this.model, "change:profile_pic", this.render);
            },

            events: {
                "click #logout"      : "logout"
            },

            render: function() {
                $(this.el).html(this.template(this.model.toJSON()));
                return this;
            },

            logout: function(){
                App.Log_User_Out();
            },

            onClose: function() {
                this.view_is_alive = false;
               if(this.Interval){
                  clearInterval(this.Interval);
                  this.Interval = null;
                }
                _.each(this.childViews, function(childView){
                      if (childView.close){
                        childView.close();
                      }
                });
            }
        });
        // export stuff:
        return Header;
    });
