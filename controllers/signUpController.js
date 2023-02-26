const User = require("../models/user");
const async = require("async");
const { body, validationResult } = require("express-validator");
const user = require("../models/user");
const bcrypt = require("bcryptjs");

exports.sign_up_page = function (req, res, next) {
  res.render("sign-up", { title: "Sign up!", errors: false, username: undefined, firstName: undefined, lastName: undefined });
};

exports.sign_up_post = [
  // Validate and sanitize fields.
  body("firstName")
  .exists({checkFalsy: true})
  .withMessage("First name must be specified")
  .trim()
  .isLength({min: 3})
  .escape()
  .withMessage("First name must be over 3 characters")
  .matches(/^[^\s]+$/)
  .withMessage('First name must not contain spaces'),

  body("lastName")
  .exists({checkFalsy: true})
  .withMessage("Last name must be specified")
  .trim()
  .isLength({min: 3})
  .escape()
  .withMessage("Last name must be over 3 characters")
  .matches(/^[^\s]+$/)
  .withMessage('Last name must not contain spaces'),

  body("username")
  .exists({checkFalsy: true})
  .withMessage("Password must be specified")
  .trim()
  .isLength({min: 3})
  .escape()
  .withMessage("Username name must be over 3 characters")
  .matches(/^[^\s]+$/)
  .withMessage('Username must not contain spaces'),

  body("password")
  .exists({checkFalsy: true})
  .withMessage("Password must be specified")
  .trim()
  .isLength({min: 3})
  .withMessage("Password length must be over 3 characters")
  .escape(),

  // Custom validator to check if confirm passwords.
  body("passwordConfirmation")
  .exists({checkFalsy: true})
  .withMessage("Please confirm password.")
  .custom((value, {req}) => value === req.body.password)
  .withMessage("Password does not match"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // There are errors, render again.
        res.render("sign-up", {
            title: "Sign up",
            username: req.body.username,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
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
