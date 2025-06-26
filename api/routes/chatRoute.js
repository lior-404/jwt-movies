const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Chat = require("../models/chat");

const { verifyUser } = require("../authenticate");
const { logger } = require("../utils/logger");
const middlewares = [verifyUser, logger];

router.post("/msgsend", middlewares, async (req, res, next) => {
  const username1 = req.user.username;
  try {
    const newUser = await User.find({ username: username1 });
    const userMsg = req.body.msg.trim();
    if (userMsg == "") {
      res.status(401).send({ message: "body empty" });
      return;
    }
    if (newUser) {
      const newMsg = {
        username: username1,
        message: req.body.msg,
        date: Date.now(),
      };

      await Chat.create(newMsg);
      const chatList = await Chat.find();
      res.status(201).send({ message: "OK", msglist: chatList });
      return;
    }
  } catch {
    res.status(401).send({ message: "Error" });
    return;
  }
});

router.get("/msgget", verifyUser, async (req, res, next) => {
  try {
    const chatList = await Chat.find();
    res.status(201).send({ message: "OK", msglist: chatList });
    return;
  } catch {
    res.status(501).send({ message: "Error" });
    return;
  }
});

router.post("/msgremoveone", middlewares, async (req, res, next) => {
  if (!req.body.msgId) {
    res.status(401).send();
    return;
  }
  const msgid = req.body.msgId;
  try {
    await Chat.deleteOne({ _id: req.body.msgId, username: req.user.username });
    const chatList = await Chat.find();
    res.status(201).send({ message: "OK", msglist: chatList });
  } catch {
    res.status(401).send();
  }
});

module.exports = router;
