const returnProperty = (value, array) => {
  const isTheSame = array.find((item, index) => {
    if (item.originalUrl == value) {
      return item;
    } else {
      return false;
    }
  });
  return isTheSame;
};

module.exports = returnProperty;
