const router = require("express").Router();
const userlogs = require("../models/userlogs");

exports.logger = async (req, res, next) => {
  console.log("Logger middleware triggered:", req.originalUrl);

  if (req.method === "GET" && req.originalUrl.startsWith("/video/")) {
    return next();
  }

  await userlogs.create({
    username: req.user.username,
    userId: req.user._id,
    url: req.originalUrl,
    extra: req.body.title || req.body.msg,
    date: Date.now(),
  });
  next();
};
