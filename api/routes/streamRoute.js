const express = require("express");
const router = express.Router();
const { verifyUser } = require("../authenticate");
const { logger } = require("../utils/logger");
const {
  convertToMp4,
  createTempFile,
  cleanupTempFiles,
} = require("../utils/streamUtils");
const { getBucket } = require("../utils/connectdb");
const Video = require("../models/video");
const FileType = require("file-type");
const fs = require("fs").promises;
const { pipeline } = require("stream/promises");
const multer = require("multer");
const rangeParser = require("range-parser");

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 3 * 1024 * 1024 * 1024, files: 1 }, // 3GB limit, 1 file
});

// Middleware for authentication and logging
const middlewares = [verifyUser, logger];

// Approved video types
const APPROVED_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];

// GET route to list videos
router.get("/list", async (req, res) => {
  try {
    const videos = await Video.find({});
    const videosList = videos.map((video) => ({
      title: video.title,
      name: video.filename,
    }));
    res.status(200).json({ success: true, list: videosList });
  } catch (error) {
    console.error("Error fetching video list:", error);
    res.status(500).json({ success: false, message: "Failed to fetch videos" });
  }
});

// GET route to stream video by filename
router.get("/video/:filename", async (req, res) => {
  try {
    const decodedFilename = decodeURIComponent(req.params.filename);

    // Find video metadata by filename
    const video = await Video.findOne({ filename: decodedFilename });
    if (!video) return res.status(404).json({ error: "Video not found" });

    const bucket = getBucket();
    const file = await bucket.find({ _id: video.fileId }).next();
    if (!file) {
      console.error(`File not found for fileId: ${video.fileId}`);
      return res.status(500).json({ error: "Video file not found in storage" });
    }

    // Ensure range header is present
    const rangeHeader = req.headers.range;
    if (!rangeHeader)
      return res.status(400).json({ error: "Range header required" });

    const ranges = rangeParser(file.length, rangeHeader);
    if (ranges === -1 || ranges === -2) {
      return res.status(416).json({ error: "Requested range not satisfiable" });
    }

    const { start, end } = ranges[0]; // Use the first range
    const contentLength = end - start + 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${file.length}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": video.contentType,
      "Cache-Control": "public, max-age=3600",
      "Last-Modified": video.uploadDate.toUTCString(),
    });

    const downloadStream = bucket.openDownloadStream(video.fileId, {
      start,
      end: end + 1,
    });
    downloadStream.pipe(res).on("error", (err) => {
      console.error("Streaming error:", err);
      res.end();
    });
  } catch (error) {
    console.error("Error streaming video:", error);
    if (!res.headersSent) {
      res
        .status(500)
        .json({ error: "Error streaming video", details: error.message });
    }
  }
});

// POST route to upload video
router.post("/upload", upload.single("file"), async (req, res) => {
  let tempInputPath = null;
  let tempOutputPath = null;

  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No video file provided" });

    // verify filename is unique, run here to prevent redundant conversion process
    const isUnique = await Video.findOne({ filename: file.originalname });
    if (isUnique) {
      return res.status(400).json({ error: "filename Taken!" });
    }

    const fileType = await FileType.fromBuffer(file.buffer);
    if (!fileType || !fileType.mime.startsWith("video/")) {
      return res.status(400).json({ error: "Uploaded file is not a video" });
    }

    let finalBuffer = file.buffer;
    let finalMimeType = fileType.mime;

    // Convert to MP4 if not an approved type
    if (!APPROVED_TYPES.includes(fileType.mime)) {
      tempInputPath = await createTempFile(file.buffer, `.${fileType.ext}`);
      tempOutputPath = await convertToMp4(tempInputPath);

      finalBuffer = await fs.readFile(tempOutputPath);
      finalMimeType = "video/mp4";
    }

    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(file.originalname, {
      contentType: finalMimeType,
    });

    // Upload buffer to GridFS
    await pipeline([finalBuffer], uploadStream);

    // Save video metadata
    const video = new Video({
      title: req.body.title || file.originalname,
      description: req.body.description || "",
      filename: file.originalname,
      contentType: finalMimeType,
      fileId: uploadStream.id,
    });

    await video.save();

    res.status(201).json({
      message: "Video uploaded successfully",
      videoId: video._id,
      originalType: fileType.mime,
      finalType: finalMimeType,
      wasConverted: finalMimeType !== fileType.mime,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ error: "Error uploading video", details: error.message });
  } finally {
    await cleanupTempFiles(tempInputPath, tempOutputPath);
  }
});

// DELETE route to remove a video by filename
router.delete("/video/delete/:filename", async (req, res) => {
  const { filename } = req.params;
  const bucket = getBucket();
  try {
    if (!bucket) {
      return res
        .status(500)
        .json({ error: "GridFSBucket is not initialized." });
    }
    // Find the video metadata in the MongoDB Video model
    const video = await Video.findOne({ filename: filename });
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }
    // Delete file from GridFS using the fileId
    await bucket.delete(video.fileId);

    // Remove the video metadata from the Video collection
    await Video.findByIdAndDelete(video._id);

    res.status(200).json({
      message: `Video '${filename}' deleted successfully.`,
      videoId: video._id,
    });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({
      error: "An error occurred while deleting the video.",
      details: error.message,
    });
  }
});

module.exports = router;
