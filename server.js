console.log("!!!!!!!!!!!!!!!");
var express  = require('express');

var MongoStore = require('connect-mongo')(express);
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var configDB = require('./config/database.js');

mongoose.connect("mongodb://dimkaipx91:84178811e7325b2711fd6513c4b3b1f3@ds053080.mongolab.com:53081/heroku_app31763119");
console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOKKKKKKKKKKKKKKKKKKKKKKKKKK");