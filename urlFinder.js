const returnProperty = (value, array) => {
  const isTheSame = array.find((item, index) => {
    if (item.originalUrl == value) {
      return item;
    } else if (item.shorturlId == value) {
      return true;
    } else {
      return false;
    }
  });
  return isTheSame;
};

module.exports = returnProperty;
