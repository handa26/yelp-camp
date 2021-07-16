const express = require("express");
const ejs = require("ejs");
const path = require("path");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("SERVER RUNNING ON PORT:3000");
});
