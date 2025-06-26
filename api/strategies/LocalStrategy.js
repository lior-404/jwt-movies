const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//called during login or sign-up.
passport.use(new LocalStrategy(User.authenticate()));

//called after log in or sign up to set user details in req.user
passport.serializeUser(User.serializeUser());