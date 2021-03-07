require("dotenv").config();
const axios = require("axios");
const BIN_URI =
  process.env.NODE_ENV === "test"
    ? process.env.DB_TEST_URI
    : process.env.DB_URI;

class DataBase {
  getBin() {
    return axios.get(`${BIN_URI}/latest`).then((res) => {
      return res.data;
    });
  }

  putBin(array) {
    return axios
      .put(BIN_URI, array)
      .then((res) => console.log(res.data.data))
      .catch((err) => console.error(err));
  }

  existBin(url, bin) {
    return axios.get(`${BIN_URI}/latest`).then((res) => {
      if (isArrayContains(url, bin)) {
        return true;
      } else {
        return false;
      }
    });
  }

  includesHTTP(url) {
    if (url.includes("https://") || url.includes("http://")) {
      return true;
    } else {
      return false;
    }
  }
}

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
