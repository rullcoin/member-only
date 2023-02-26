require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const passport = require("passport");
const session = require("express-session");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("./models/user");

const indexRouter = require("./routes/index");
const signupRouter = require("./routes/signUp");
const loginRouter = require("./routes/login");

const app = express();

// Set up DB
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
const mongoDB = process.env.DB_API_KEY;

async function main() {
  await mongoose.connect(mongoDB);
}
main().catch((err) => console.log(err));
// 

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(expressLayouts);

// Add session and passport middleware
app.use(
  session({
    secret: "cats",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Custom middleware to create a "currentUser" variable accessible in all of the views without passing it directly to our controllers (GET)
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

// Set up local strategy for passport
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }

      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match! log user in
          return done(null, user);
        } else {
          // passwords do not match!
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

// Sessions and serialization.
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use("/", indexRouter);
app.use("/sign-up", signupRouter);
app.use("/login", loginRouter);

// Logout function
app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
