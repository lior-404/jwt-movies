const express = require("express");
const router = express.Router();
const User = require("../models/user");
const UserLogs = require("../models/userlogs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { logger } = require("../utils/logger");

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../authenticate");

// router.get("/me", verifyUser, (req, res, next) => {
//   res.send(req.user);
// });

router.get("/logs", verifyUser, async (req, res, next) => {
  try {
    const docs = await UserLogs.find();
    if (docs) {
      res.send({ success: true, logs: docs });
    }
  } catch (err) {
    console.log("in err: ", err);
    res.send({ success: false, logs: null });
  }
});

router.get("/logout", verifyUser, async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      const tokenIndex = user.refreshToken.findIndex(
        (item) => item.refreshToken === refreshToken
      );

      if (tokenIndex !== -1) {
        user.refreshToken.splice(tokenIndex, 1);
      }
      const savedUser = await user.save();

      res.clearCookie("refreshToken", COOKIE_OPTIONS);
      res.send({ success: true });
    }
  } catch (err) {
    res.statusCode = 500;
    res.send(err);
  }
});

router.post("/refreshToken", async (req, res, next) => {
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;

  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      const userId = payload._id;
      const user = await User.findOne({ _id: userId });
      if (user) {
        //find the refresh token agains the user recored in db
        const tokenIndex = user.refreshToken.findIndex(
          (item) => item.refreshToken === refreshToken
        );
        if (tokenIndex === -1) {
          res.statusCode = 401;
          res.send("Unauthorized");
        } else {
          const token = getToken({ _id: userId });
          const username2 = user.username;
          //if refresh token exists, then create new one and replace it.
          const newRefreshToken = getRefreshToken({ _id: userId });
          // user.refreshToken[tokenIndex] = {refreshToken: newRefreshToken};
          user.refreshToken[0] = { refreshToken: newRefreshToken };

          try {
            const savedUser = await user.save();
            res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
            res.send({ success: true, token, username: username2 });
          } catch (err) {
            res.statusCode = 500;
            res.send(err);
            // next(err);
          }
        }
      }
      // res.statusCode = 401;
      // res.send("Unauthorized");
    } catch (err) {
      res.statusCode = 401;
      res.send("Unauthorized");
    }
  } else {
    res.statusCode = 401;
    res.send("Unauthorized");
  }
});

router.post(
  "/login",
  [passport.authenticate("local", { session: false }), logger],
  async (req, res, next) => {
    const token = getToken({ _id: req.user._id });
    const refreshToken = getRefreshToken({ _id: req.user._id });

    try {
      const user = await User.findById(req.user._id);
      if (user) {
        user.refreshToken[0] = { refreshToken };
        //     user.refreshToken.push({refreshToken});
        const savedUser = await user.save();
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        res.send({ success: true, token });
      }
    } catch (err) {
      res.statusCode = 500;
      res.send(err);
      next(err);
    }
  }
);

router.post("/signup", (req, res, next) => {
  if (!req.body.username) {
    res.statusCode = 500;
    res.send({
      name: "Username Error",
      message: "Please fill in all fields.",
    });
  } else if (req.body.username.includes("@")) {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      async (err, user) => {
        if (err) {
          res.statusCode = 500;
          res.send(err);
        } else {
          user.role = req.body.role || "";
          const token = getToken({ _id: user._id });
          const refreshToken = getRefreshToken({ _id: user._id });
          user.refreshToken.push({ refreshToken });
          try {
            const savedUser = await user.save();
            res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
            res.send({ success: true, token });
          } catch (err) {
            res.statusCode = 501;
            res.send(err);
          }
        }
      }
    );
  } else {
    res.statusCode = 500;
    res.send({
      name: "FirstNameError",
      message: "Please enter correct email.",
    });
  }
});

module.exports = router;
