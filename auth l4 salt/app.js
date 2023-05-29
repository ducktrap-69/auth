require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
const _ = require("lodash");
const ejs = require("ejs");

//encrypt
const bcrypt = require("bcrypt");
const saltRounds = 10;
const myPlaintextPassword = "s0//P4$$w0rD";
const someOtherPlaintextPassword = "not_bacon";

// const req = require("express/lib/request");
// const { json } = require("body-parser");
// const { name } = require("ejs");

const app = express();

// ejs module
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

// adding mongodb to project
mongoose.connect(
  "mongodb+srv://duck_trap_69:duck69trap@cluster0.dwlz9ap.mongodb.net/userDB"
);
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = mongoose.model("User", userSchema);
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

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = new User({
      email: req.body.username,
      password: hash,
    });
    newUser
      .save()
      .then(() => {
        res.render("secrets");
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

app.post("/login", function (req, res) {
  userEmail = req.body.username;
  userPassword = req.body.password;

  User.findOne({ email: userEmail })
    .then((user) => {
      bcrypt.compare(userPassword, user.password, function (err, result) {
        if (result === true) {
          res.render("secrets");
        } else {
          console.log("password mis match");
        }
      });
    })
    .catch((err) => {
      console.log("user not found");
    });
});
////////////////////////////////////////////////end//////////////////////////////////////////////////////////////
app.listen(process.env.PORT || 3000, function () {
  console.log("server active comander");
});
