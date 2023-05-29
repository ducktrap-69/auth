require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mongoose = require("mongoose");
const _ = require("lodash");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");

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

const secret = "thisismybigsecreat.";
userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
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
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
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

app.post("/login", function (req, res) {
  userEmail = req.body.username;
  userPassword = req.body.password;

  User.findOne({ email: userEmail })
    .then((user) => {
      if (user.password === userPassword) {
        res.render("secrets");
      } else {
        console.log("password mis match");
      }
    })
    .catch((err) => {
      console.log("user not found");
    });
});
////////////////////////////////////////////////end//////////////////////////////////////////////////////////////
app.listen(process.env.PORT || 3000, function () {
  console.log("server active comander");
});
