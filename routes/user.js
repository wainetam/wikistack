// for Passport
var models = require("../models");

var passport = require('passport');
// local strategy for Passport
var LocalStrategy = require('passport-local').Strategy;

/*
 * GET users listing.
 */

exports.list = function(req, res) {
  res.send("respond with a resource");
};

exports.login = function(req, res) {
  res.render('login', {});
};

exports.auth = function(req, res) {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.

  console.log('in auth function');
  var username = req.body.username;
  var password = req.body.password;
  var user = req.user;

  console.log('user? ', user);

  res.redirect('/');
};

// exports.authfail = function(req, res) {
//   // If this function gets called, authentication was NOT successful.
//   console.log('in authfail function');
//   res.redirect('/login');
// };

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

exports.new = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  var u = new models.User({"username":username, "password":password});
  u.save();
  res.redirect('/');
};
