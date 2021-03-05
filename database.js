const axios = require("axios");
const BIN_URL = "https://api.jsonbin.io/b/603fb1b30866664b1087fd97";

class DataBase {
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

  existBin(url, bin) {
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
    } else if (item.shorturlId == value) {
      return true;
    } else {
      return false;
    }
  });
  return isTheSame;
};

module.exports = DataBase;
