const User = require("../models/user");
const async = require("async");
const { body, validationResult } = require("express-validator");
const user = require("../models/user");
const bcrypt = require("bcryptjs");

exports.sign_up_page = function (req, res, next) {
  res.render("sign-up", { title: "hella" });
};

exports.sign_up_post = [
  // Validate and sanitize fields.
  body("firstName")
  .trim()
  .isLength({min: 3})
  .escape()
  .withMessage("First name must be specified"),

  body("lastName")
  .trim()
  .isLength({min: 3})
  .escape()
  .withMessage("Last name must be specified"),

  body("username")
  .trim()
  .isLength({min: 3})
  .escape()
  .withMessage("Username must be specified"),

  body("password")
  .trim()
  .isLength({min: 3})
  .withMessage("Password length must be over 3 characters")
  .escape()
  .withMessage("Password must be specified"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // There are errors, render again.
        res.render("sign-up", {
            title: "Sign up",
            username: req.body.username,
            errors: errors.array(),
        })
        return;
    }
    // Form is valid.

    const user = new User({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      username: req.body.username,
    });

    // Hash password
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }
      user.password = hashedPassword;

      user.save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    });
  },
];
