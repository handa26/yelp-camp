const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");

mongoose.connect("mongodb://localhost:27017/yelpCampDB", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("SERVER RUNNING ON PORT:3000");
});
