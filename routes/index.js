var express = require("express");
var router = express.Router();
const Message = require("../models/message");
const async = require("async");

// Redirect if no query page.
function redirectToFirstPage(req, res, next) {
  if (!req.query.page) {
    return res.redirect('/?page=1');
  }
  next();
}

/* GET home page. */
router.get("/", redirectToFirstPage, function (req, res, next) {
  // pagination
  const perPage = 2;
  const page = parsetInt(req.query.page);
  const startIndex = page - 1;

  async.parallel(
    {
      message(callback) {
        Message.find({})
          .populate("user")
          .skip(startIndex)
          .limit(perPage)
          .exec(callback);
      },
      messageCount(callback) {
        Message.countDocuments().exec(callback);
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

      const totalPages = Math.ceil(results.messageCount / perPage);

      console.log(totalPages + "total pages in log");


      res.render("index", {
        title: "Member only",
        messages: results.message,
        currentPage: page,
        totalPages: totalPages,
      });
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
