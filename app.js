require("dotenv").config();
const express = require("express");
const cors = require("cors");
const DataBase = require("./database");
const returnProperty = require("./urlFinder");
const app = express();
const bin = [];

app.use(cors());
app.use(express.json({ extended: false }));
app.use("/public", express.static(`./public`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl/new/", async (req, res) => {
  let wantedURL;
  DataBase.existBin(req.body.url, bin).then((res) => {
    let exist = res;
    if (!exist) {
      const DB = new DataBase(req.body.url);
      console.log("putting new");
      bin.push(DB);
      DB.putBin(bin);
      wantedURL = DB;
    } else {
      wantedURL = returnProperty(req.body.url, bin);
      console.log("already exist");
      console.log(returnProperty(req.body.url, bin));
    }
  });
  res.send(wantedURL);
});

module.exports = app;
