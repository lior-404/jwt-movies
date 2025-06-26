const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
var methodOverride = require("method-override");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const { connectDB } = require("./utils/connectdb");
connectDB();

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

const userRouter = require("./routes/userRoute");
const movieRouter = require("./routes/movieRoute");
const chatRouter = require("./routes/chatRoute");
const streamsRouter = require("./routes/streamRoute");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== 1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(passport.initialize());
app.use(methodOverride("_method"));

//routes
app.use("/users", userRouter);
app.use("/movies", movieRouter);
app.use("/chat", chatRouter);
app.use("/streams", streamsRouter);

// Serve React static files
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public/dist"))); // Adjust "dist" if your build folder is named differently
  // Catch-all route to serve `index.html` for React routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public/dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send({ status: "success" });
  });
}

//start server at port 8081
const server = app.listen(process.env.PORT || 8081, () => {
  const port = server.address().port;

  console.log("App started at port: ", port);
});
