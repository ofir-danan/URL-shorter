const returnProperty = function (value, array) {
  const isTheSame = array.find(function (item, index) {
    if (item.originalUrl == value) {
      return item;
    } else {
      return false;
    }
  });
  return isTheSame;
};

module.exports = returnProperty;
