console.log("!!!!!!!!!!!!!!!");
var express  = require('express');

var MongoStore = require('connect-mongo')(express);
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var configDB = require('./config/database.js');
console.log(">>>> Connect");
mongoose.connect(configDB.url);
console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOKKKKKKKKKKKKKKKKKKKKKKKKKK");