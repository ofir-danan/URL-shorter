require("dotenv").config();
const express = require("express");
const cors = require("cors");
const DataBase = require("./database");
const returnProperty = require("./urlFinder");
const shortid = require("shortid");
const bodyParser = require("body-parser");
const { response } = require("express");
const { default: urlExistDeep } = require("url-exists-deep");
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

// json page with statistics
app.get("/api/statistic/:shorturlId", (req, res) => {
  const { shorturlId } = req.params;
  try {
    DB.getBin().then((bin) => {
      let result = [bin];
      let binContent = result.flat(2); // to keep out extra "[]" inside the array
      DB.existBin(shorturlId, binContent).then((exist) => {
        if (!exist) {
          alert("Shortener URL does not exist");
          res.status(404).json("Shortener URL does not exist");
        } else {
          let urlExist = returnProperty(shorturlId, binContent);
          res.json(urlExist);
        }
      });
    });
  } catch {
    res.status(400).json("Bad request");
  }
});

//adding or getting shortener URLs
app.post("/api/shorturl/new/", (req, res) => {
  try {
    DB.getBin().then(async (bin) => {
      let result = [bin];
      let binContent = result.flat(2);
      let { url } = req.body;
      if (!DB.includesHTTP(url)) {
        url = "http://" + url;
      }
      urlExistDeep(url).then((exists) => {
        // finds if the URL lead to somewhere
        if (exists) {
          DB.existBin(url, binContent).then((exist) => {
            // and if already created
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
              binContent.push(newUrl);
              DB.putBin(binContent);
              res.json(newUrl);
            } else {
              let urlExist = returnProperty(url, binContent);
              res.json(urlExist);
            }
          });
        } else {
          alert("URL is not valid");
          res.status(400).json("URL is not valid");
        }
      });
    });
  } catch (err) {
    alert("Something want wrong with your request");
    console.error("Something want wrong with your request");
    res.status(500).json("Something want wrong with your request");
  }
});

//redirect to original URL
app.get("/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;
  try {
    DB.getBin().then((bin) => {
      let result = [bin];
      let binContent = result.flat(2);
      DB.existBin(shortUrl, binContent).then((exist) => {
        if (!exist) {
          alert("Shortener URL does not exist");
          res.status(404).json("Shortener URL does not exist");
        } else {
          let urlExist = returnProperty(shortUrl, binContent);
          binContent.forEach((element) => {
            if (element.shorturlId === shortUrl) {
              element.redirectCount++;
            }
          });
          DB.putBin(binContent).then(() => res.redirect(urlExist.originalUrl));
        }
      });
    });
  } catch {
    res.status(400).json("Bad request");
  }
});

module.exports = app;
