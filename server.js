console.log("!!!!!!!!!!!!!!!");
var express  = require('express');

var MongoStore = require('connect-mongo')(express);
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var configDB = require('./config/database.js');

mongoose.connect("mongodb://heroku_app31763119:31nopdab5dgq7c934i0hvksivs@ds053080.mongolab.com:53080/heroku_app31763119");
console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOKKKKKKKKKKKKKKKKKKKKKKKKKK");