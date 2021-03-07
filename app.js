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

app.get("/api/statistic/:shorturlId", (req, res) => {
  const { shorturlId } = req.params;
  DB.getBin().then((bin) => {
    let result = [bin];
    let binContent = result.flat(2);
    DB.existBin(shorturlId, binContent).then((exist) => {
      if (!exist) {
        res.send("Shortener URL does not exist");
      } else {
        let urlExist = returnProperty(shorturlId, binContent);
        console.log("already exist");
        res.json(urlExist);
      }
    });
  });
});
app.post("/api/shorturl/new/", (req, res) => {
  try {
    DB.getBin().then((bin) => {
      let result = [bin];
      let binContent = result.flat(2);
      let url = req.body.url;
      console.log(req.body);
      if (!url.includes("https://") || !url.includes("http://")) {
        url = "http://" + url;
      }
      DB.existBin(url, binContent).then((exist) => {
        if (!exist) {
          let newUrl = {
            originalUrl: url,
            shorturlId: shortid.generate(),
            creationDate: new Date()
              .toISOString()
              .slice(0, 19)
              .replace("T", " "),
            redirectCount: 0,
          };
          console.log("putting new");
          binContent.push(newUrl);
          DB.putBin(binContent);
          res.json(newUrl);
        } else {
          let urlExist = returnProperty(url, binContent);
          console.log("already exist");
          console.log(urlExist);
          res.json(urlExist);
        }
      });
    });
  } catch (err) {
    console.error("Something want wrong with your request");
  }
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
        binContent.forEach((element) => {
          if (element.shorturlId === shortUrl) {
            element.redirectCount++;
          }
        });
        DB.putBin(binContent).then(() => res.redirect(urlExist.originalUrl));
      }
    });
  });
});

module.exports = app;
