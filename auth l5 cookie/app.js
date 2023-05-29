// for level 5 install ('passport' 'passport-local' 'passport-local-mongoose' 'express-session')
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
const _ = require("lodash");
const ejs = require("ejs");

//encrypt
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

// const req = require("express/lib/request");
// const { json } = require("body-parser");
// const { name } = require("ejs");

const app = express();

// ejs module
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// cookie session setup
app.use(
  session({
    secret: "MyBigSeccret",
    resave: false,
    saveUninitialized: false,
    // cookie: { secure: true },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// adding mongodb to project
mongoose.connect(
  "mongodb+srv://duck_trap_69:duck69trap@cluster0.dwlz9ap.mongodb.net/userDB"
);
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
///////////////////////////////////////////////start//////////////////////////////////////////////////////////////

app.get("/", function (req, res) {
  res.render("home");
});
app.get("/login", function (req, res) {
  res.render("login");
});
app.get("/register", function (req, res) {
  res.render("register");
});
app.get("/secrets", function (req, res) {
  if (req.isAuthenticated()) {
    res.render("secrets");
  } else {
    res.redirect("/login");
  }
});
app.get("/logout", function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
});

app.post("/register", function (req, res) {
  User.register({ username: req.body.username }, req.body.password)
    .then(() => {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    }
  });
});

////////////////////////////////////////////////end//////////////////////////////////////////////////////////////
app.listen(process.env.PORT || 3000, function () {
  console.log("server active comander");
});
