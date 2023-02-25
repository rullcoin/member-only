const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  username: { type: Schema.Types.ObjectId, required: true },
  timestamp: { type: Date, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true, maxLength: 300 },
});

module.exports = mongoose.model("Message", MessageSchema);
