const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true, maxLength: 15 },
  password: { type: String, require: true },
  membership: false,
});

module.exports = mongoose.model("User", UserSchema);
