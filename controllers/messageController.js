const Message = require("../models/message");
const async = require("async");
const { body, validationResult } = require("express-validator");

exports.message_get = function (req, res, next) {
    res.render("create_message", {errors: null});
  };

exports.message_post = [
    //validate and sanitize fields
    body("title")
    .exists({checkFalsy: true})
    .withMessage("Title must be specified")
    .trim()
    .escape(),

    body("message")
    .exists({checkFalsy: true})
    .withMessage("Specify a message")
    .trim()
    .escape(),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            res.render("create_message", {
                errors: errors.array(),
            })
        return
        }
        
        const newMessage = new Message({
            user: req.user._id,
            timestamp: new Date(),
            title: req.body.title,
            body: req.body.message
        })

        newMessage.save((err) => {
            if (err) {
                return next(err)
            }
            res.redirect("/")
        })
    }
]

