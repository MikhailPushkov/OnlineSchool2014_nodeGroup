// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var fs = require("fs");
var moment = require("moment");

var userSchema = mongoose.Schema({
    local            : {
        login        : {type: String, index: {unique: true}},
        password     : {type: String, required: true, trim: true}
    },
    role     : {type: String, trim: true},
    itemId : {type: String, trim: true}
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

userSchema.methods.remove_local = function(){
    return delete this.local;
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
