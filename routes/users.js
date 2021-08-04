const express = require("express");
const passport = require("passport");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const User = require("../models/user");

const router = express.Router();

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registeredUser = await User.register(user, password);

      // When user registered, automatically in login state
      req.login(registeredUser, (err) => {
        if (err) return next(err);

        req.flash("success", "Welcome to YelpCamp!");
        res.redirect("/campgrounds");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync(async (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
});

module.exports = router;
