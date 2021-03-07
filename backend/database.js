require("dotenv").config();
const axios = require("axios");
// run deferent JSONBIN for test or client
const BIN_URI =
  process.env.NODE_ENV === "test"
    ? process.env.DB_TEST_URI
    : process.env.DB_URI;

class DataBase {
  // get all the URLs
  getBin() {
    return axios.get(`${BIN_URI}/latest`).then((res) => {
      return res.data;
    });
  }

  // update the bin
  putBin(array) {
    return axios.put(BIN_URI, array).catch((err) => console.error(err));
  }

  // find if exist
  existBin(url, bin) {
    return axios.get(`${BIN_URI}/latest`).then((res) => {
      if (isArrayContains(url, bin)) {
        return true;
      } else {
        return false;
      }
    });
  }

  // check for http:// start in the URL
  includesHTTP(url) {
    if (url.includes("https://") || url.includes("http://")) {
      return true;
    } else {
      return false;
    }
  }
}

// check for the original or short URL in the array
const isArrayContains = function (value, array) {
  const isTheSame = array.find(function (item, index) {
    if (item.originalUrl == value) {
      return true;
    } else if (item.shorturlId == value) {
      return true;
    } else {
      return false;
    }
  });
  return isTheSame;
};

module.exports = DataBase;
