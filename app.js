require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const {
  readFileSync,
  writeFileSync,
  appendFileSync,
  unlinkSync,
  readdirSync,
  existsSync,
} = require("fs");
const shortUrl = require("shortid");
const JSON_BIN_URL = "https://api.jsonbin.io/b/603fb1b30866664b1087fd97";

app.use(cors());

app.use("/public", express.static(`./public`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

module.exports = app;
