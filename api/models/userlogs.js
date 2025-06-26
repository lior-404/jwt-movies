const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserLogs = new Schema({
  username: {
    type: String,
    default: "",
  },
  userId: {
    type: String,
  },
  url: {
    type: String,
  },
  extra: {
    type: String,
    default: "",
  },
  date: { type: Date },
});

//remove id from response.
UserLogs.set("toJSON", {
  transform: function (doc, ret, options) {
    delete ret.userId;
    return ret;
  },
});

module.exports = mongoose.model("UserLogs", UserLogs);
