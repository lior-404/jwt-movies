const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Chat = new Schema({
  username: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
  date: { type: Date },
});

//remove id from response.
// UserLogs.set("toJSON", {
//   transform: function (doc, ret, options) {
//     delete ret.userId;
//     return ret;
//   },
// });

module.exports = mongoose.model("Chat", Chat);
