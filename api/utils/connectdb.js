const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

mongoose.set("strictQuery", true);
let bucket;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);

    // Initialize GridFS bucket
    bucket = new GridFSBucket(conn.connection.db, {
      bucketName: "videos1",
    });

    console.log("Connected to DB Successfully!");
    return bucket;
  } catch (error) {
    console.error("Error connecting to DB:", error);
    process.exit(1);
  }
};

module.exports = { connectDB, getBucket: () => bucket };
