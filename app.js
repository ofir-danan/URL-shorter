require("dotenv").config();
const express = require("express");
const cors = require("cors");
const DataBase = require("./database");
const returnProperty = require("./urlFinder");
const shortid = require("shortid");
const bodyParser = require("body-parser");
const app = express();
const DB = new DataBase();

app.use(cors());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use("/public", express.static(`./public`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/shorturl/new/", (req, res) => {
  DB.getBin().then((bin) => {
    let result = [bin];
    let binContent = result.flat(2);
    DB.existBin(req.body.url, binContent).then((exist) => {
      if (!exist) {
        let newUrl = {
          originalUrl: req.body.url,
          shorturlId: shortid.generate(),
          creationDate: new Date().toISOString().slice(0, 19).replace("T", " "),
          redirectCount: 0,
        };
        console.log("putting new");
        binContent.push(newUrl);
        DB.putBin(binContent);
        res.json(newUrl);
      } else {
        let urlExist = returnProperty(req.body.url, binContent);
        console.log("already exist");
        console.log(urlExist);
        res.json(urlExist);
      }
    });
  });
});

app.get("/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;
  DB.getBin().then((bin) => {
    let result = [bin];
    let binContent = result.flat(2);
    DB.existBin(shortUrl, binContent).then((exist) => {
      if (!exist) {
        res.send("Shortener URL not exist");
      } else {
        let urlExist = returnProperty(shortUrl, binContent);
        console.log("already exist");
        console.log(typeof urlExist.originalUrl);
        if (urlExist.originalUrl.includes("https://")) {
          return res.redirect(urlExist.originalUrl);
        } else if (urlExist.originalUrl.includes("http://")) {
          return res.redirect(urlExist.originalUrl);
        } else {
          return res.redirect(`http://${urlExist.originalUrl}`);
        }
      }
    });
  });
});

module.exports = app;
