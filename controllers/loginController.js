const User = require("../models/user");
const async = require("async");
const { body, validationResult } = require("express-validator");
const passport = require("passport");


// Local strategy to find user in our DB


exports.login_get = function(req, res, next) {
    res.render("login", {title: "Login", errors: false})
}

exports.login_post = function(req, res, next) {
    passport.authenticate("local", {
      successRedirect: "/login",
      failureRedirect: "/",
    })(req, res, next);
  };
    
