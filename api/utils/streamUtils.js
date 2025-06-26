const path = require("path");
const fs = require("fs").promises;
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Helper function to create temporary file
async function createTempFile(buffer, extension) {
  const tempPath = path.join(
    __dirname,
    `../temp/temp-${Date.now()}${extension}`
  );
  await fs.mkdir(path.dirname(tempPath), { recursive: true });
  await fs.writeFile(tempPath, buffer);
  return tempPath;
}

// Helper function to convert video to MP4
async function convertToMp4(inputPath) {
  const outputPath = inputPath.replace(/\.[^/.]+$/, "") + "_converted.mp4";

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .toFormat("mp4")
      .videoCodec("libx264") // H.264 codec
      .videoBitrate("2000k")
      .outputOptions([
        "-vf",
        "format=yuv420p", // Force 8-bit color conversion
        "-crf",
        "23", // Balanced quality
        "-preset",
        "medium",
      ])
      .audioCodec("aac")
      .audioChannels(2) // Downmix to stereo
      .audioBitrate("128k")
      .on("progress", (progresses) => {
        console.log(`Processing: ${progresses.timemark}`);
      })
      .on("error", (err) => reject(err))
      .on("end", () => {
        console.log("Done!");
        resolve(outputPath);
      })
      .save(outputPath);
  });
}

// Helper function to clean up temporary files
async function cleanupTempFiles(...files) {
  for (const file of files) {
    try {
      if (file) {
        await fs.unlink(file);
      }
    } catch (error) {
      console.error(`Error cleaning up file ${file}:`, error);
    }
  }
}

module.exports = { convertToMp4, cleanupTempFiles, createTempFile };
