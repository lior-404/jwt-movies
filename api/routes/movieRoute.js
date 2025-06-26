const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../authenticate");
const { logger } = require("../utils/logger");
const middlewares = [verifyUser, logger];

router.post("/removeMovie", middlewares, (req, res, next) => {
  const newMovie = {
    title: req.body.title,
    id: req.body.id,
  };
  User.findById(req.user._id).then(
    async (user) => {
      let movieIndex = -1;
      user.movies.findIndex((item) => {
        if (item.id === req.body.id) {
          movieIndex = 1;
        }
      });

      if (movieIndex === 1) {
        const movieIndex = user.movies.findIndex((i) => newMovie.id === i.id);
        movieIndex === -1 ? null : user.movies.splice(movieIndex, 1);
        try {
          const savedUser = await user.save();
          res.send({ message: "Removed movie successfully." });
        } catch (err) {
          res.statusCode = 500;
          res.send(err);
        }
      } else {
        res.send({ message: "No movie to remove!" });
      }
    },
    (err) => next(err)
  );
});

router.post("/saveMovie", middlewares, (req, res, next) => {
  const newMovie = {
    title: req.body.title,
    original_name: req.body.original_name,
    poster_path: req.body.poster_path,
    overview: req.body.overview,
    vote_average: req.body.vote_average,
    release_date: req.body.release_date,
    first_air_date: req.body.first_air_date,
    id: req.body.id,
  };
  User.findById(req.user._id).then(
    async (user) => {
      let movieIndex = -1;
      user.movies.findIndex((item) => {
        if (item.id === req.body.id) {
          movieIndex = 1;
        }
      });

      if (movieIndex === -1) {
        user.movies.push(newMovie);
        try {
          const savedUser = await user.save();
          res.send({ message: "added to db successfully." });
        } catch (err) {
          res.statusCode = 500;
          res.send(err);
        }
      } else {
        res.send({ message: "movie already saved!" });
      }
    },
    (err) => next(err)
  );
});

router.get("/favorites", verifyUser, (req, res, next) => {
  User.findById(req.user._id).then(
    (user) => {
      const favoriteMovieList = user.movies;
      res.send({ movieList: favoriteMovieList });
    },
    (err) => next(err)
  );
});

module.exports = router;
