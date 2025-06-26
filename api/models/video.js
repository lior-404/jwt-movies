const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  filename: { type: String, required: true, unique: true },
  contentType: { type: String, required: true },
  duration: { type: Number },
  uploadDate: { type: Date, default: Date.now },
  // Using MongoDB's GridFS under the hood, we only store metadata here
  fileId: { type: mongoose.Schema.Types.ObjectId, required: true },
});

const Video = mongoose.model("Videos", videoSchema);
module.exports = Video;
