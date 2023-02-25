#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line

const async = require("async");
const User = require("./models/user");
const Message = require("./models/message");

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = "mongodb+srv://rull:lfsscoot@cluster0.psbtvow.mongodb.net/?retryWrites=true&w=majority"

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const users = [];
const messages = [];

function userCreate(first_name, last_name, username, password, cb) {
  userdetail = {
    first_name: first_name,
    last_name: last_name,
    username: username,
    password: password,
  };

  const user = new User(userdetail);

  user.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New user: " + user);
    users.push(user);
    cb(null, user);
  });
}

function messageCreate(username, timestamp, title, body, cb) {
  messagedetail = {
    username: username,
    timestamp: timestamp,
    title: title,
    body: body,
  };

  const message = new Message(messagedetail);

  message.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log("New message: " + message);
    messages.push(message);
    cb(null, message);
  });
}

function createUsers(cb) {
  async.parallel(
    [
      function (callback) {
        userCreate(
          "rully",
          "orbun",
          "rully1",
          "hello",
          callback
        );
      },
      function (callback) {
        userCreate(
          "rullier",
          "orbunee",
          "rully2",
          "hello111",
          callback
        );
      },
      function (callback) {
        userCreate(
          "rullyeragh",
          "orbunatio",
          "rully3",
          "eeee",
          callback
        );
      },
      function (callback) {
        userCreate(
          "rullazb",
          "orbunazb",
          "rully4",
          "ann",
          callback
        );
      },
      function (callback) {
        userCreate(
          "rulltyg",
          "orbunan",
          "rully5",
          "hello",
          callback
        );
      }
    ],
    // optional callback
    cb
  );
}

function createMessages(cb) {
  async.series(
    [
      function (callback) {
        messageCreate(
          users[0],
          "1973-06-06",
          "Title of the man",
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at vestibulum lacus. In gravida magna et arcu volutpat, a maximus ante fringilla. Integer lobortis bl",
          callback
        );
      },
      function (callback) {
        messageCreate(
          users[0],
          "1932-11-8",
          "My app",
          "r nunc felis, scelerisque et dignissim id, consectetur et elit. Nulla efficitur sem nec venenatis laoreet. Maecenas consectetur ex id lacinia scelerisque. Phasellus eg",
          callback
        );
      },
      function (callback) {
        messageCreate(
          users[0],
          "1992-04-06",
          "Hello",
          "teger scelerisque rutrum elit eu dapibus. Ut non nulla at nulla ornare laoreet. Proin non mollis neque. Sed pharetra, urna id efficitur iaculis, ligula dolor cur",
          callback
        );
      },
      function (callback) {
        messageCreate(
          users[0],
          "2000-10-24",
          "Salut",
          "Praesent vehicula pulvinar leo et luctus. Donec scelerisque laoreet leo, at semper lectus. Suspendisse volutpat nisi non tortor finibus, ut porta nunc dictum",
          callback
        );
      },
      function (callback) {
        messageCreate(
          users[0],
          "1971-12-16",
          "Haha",
          "s aliquam, orci nec tincidunt pellentesque, mi mi vulputate neque, non dapibus tellus augue eu tortor. Sed sit amet sem elementum, efficitur lectus in, imp",
          callback
        );
      },
    ],
    // optional callback
    cb
  );
}

async.series(
  [createUsers, createMessages],
  // Optional callback
  function (err, results) {
    if (err) {
      console.log("FINAL ERR: " + err);
    } else {
      console.log("BOOKInstances: ");
    }
    // All done, disconnect from database
    mongoose.connection.close();
  }
);
