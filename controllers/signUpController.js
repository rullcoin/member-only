const User = require("../models/user");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.sign_up_page = function(req, res, next) {
    res.render("sign-up", {title: "hella"})
}