const axios = require("axios");
const { isValid } = require("shortid");
const shortid = require("shortid");
const BIN_URL = "https://api.jsonbin.io/b/603fb1b30866664b1087fd97";

class DataBase {
  constructor(fullUrl) {
    this.originalUrl = fullUrl;
    this.shorturlId = shortid.generate();
    this.creationDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    this.redirectCount = 0;
  }

  getBin() {
    return axios.get(`${BIN_URL}/latest`).then((res) => {
      return res.data;
    });
  }

  putBin(array) {
    return axios
      .put(BIN_URL, array)
      .then((res) => console.log(res.data.data))
      .catch((err) => console.error(err));
  }

  static existBin(url, bin) {
    return axios.get(`${BIN_URL}/latest`).then((res) => {
      if (isArrayContains(url, bin)) {
        return true;
      } else {
        return false;
      }
    });
  }
}

const isArrayContains = function (value, array) {
  const isTheSame = array.find(function (item, index) {
    if (item.originalUrl == value) {
      return true;
    } else {
      return false;
    }
  });
  return isTheSame;
};

module.exports = DataBase;
