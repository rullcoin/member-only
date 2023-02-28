var express = require("express");
var router = express.Router();
const Message = require("../models/message");
const async = require("async");

/* GET home page. */
router.get("/", function (req, res, next) {
  async.parallel(
    {
      message(callback) {
        Message.find({}).populate("user").exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (results.message === null) {
        // nothing
        const err = new Error("Messages not found");
        err.status = 404;
        return next(err);
      }
      res.render("index", { title: "Member only", messages: results.message });
    }
  );
});

router.post("/", (req, res, next) => {
  async.parallel(
    {
      message(callback) {
        Message.findById(req.body.postid).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.message == null) {
       return res.redirect("/");
      }

      Message.findByIdAndRemove(req.body.postid, (err) => {
        if (err) {
          return next(err);
        }
        return res.redirect("/");
      });
    }
  );
});

module.exports = router;
