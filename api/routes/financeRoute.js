const express = require("express");
const router = express.Router();
const FinDoc = require("../models/financeElement");

const { verifyUser } = require("../authenticate");
const { logger } = require("../utils/logger");
const middlewares = [verifyUser, logger];

router.post("/fin/newElement", middlewares, async (req, res, next) => {
  const username1 = req.user.username;
  try {
    const newFinDoc = req.body.finDoc;
    if (newFinDoc.username == "" && newFinDoc.tableType == "") {
      await FinDoc.create(newFinDoc);
      res.status(201).send({ message: "OK" });
    }
  } catch {
    res.status(401).send({ message: "Error" });
    return;
  }
});

module.exports = router;
