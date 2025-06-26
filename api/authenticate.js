const passport = require("passport");
const jwt = require("jsonwebtoken");

//used for creating refresh tokens cookie, would be httpOnly and secure, so it won't be read by the clients JS.
exports.COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  signed: true,
  // maxAge: eval(process.env.REFRESH_TOKEN_EXPIRY) * 1000,
  sameSite: "none",
};

//used to create the JWT
exports.getToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: eval(process.env.SESSION_EXPIRY),
  });
};

//to create the refresh token, which is a JWT.
exports.getRefreshToken = (user) => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: eval(process.env.REFRESH_TOKEN_EXPIRY),
  });
  return refreshToken;
};

//verifyUser is a middleware that needs to be called for every authenticated request.
exports.verifyUser = passport.authenticate("jwt", { session: false });
