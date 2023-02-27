const User = require("../models/user");
const async = require("async");
const { body, validationResult } = require("express-validator");
const passport = require("passport");

exports.login_get = function (req, res, next) {
  res.render("login", { title: "Login", errors: false });
};

exports.login_post = function (req, res, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  })(req, res, next);
};

exports.join_club_get = function (req, res, next) {
  res.render("join_club", {
    errors: null
  });
};

exports.join_club_post = [
  body("secretPassword")
    .trim()
    .custom((value) => value === process.env.SECRET_PASSWORD)
    .withMessage("Secret code is incorrect"),

  (req, res, next) => {
    const errors = validationResult(req);

    // Access current user middleware.

    if (!errors.isEmpty()) {
      res.render("join_club", {
        errors: errors.array()
      });
      return;
    }

    if (!req.isAuthenticated()) {
        console.log("unauth");
        // User is not authenticated, redirect to login page or do something else
        res.redirect("/login");
        return;
      }


    // They entered correct password, find and update membership status
    User.updateOne({ _id: req.user._id }, { membership: true}, (err) => {
        if (err) {
          return next(err);
        }
        console.log("successfully changed membership");
        res.redirect("/join_club")
        
        
    })
  },
];
