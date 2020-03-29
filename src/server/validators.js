const validators = {
  /**
   * Check url for consistency
   * @param {*} url
   * @return {boolean} true when url has a valid syntax
   */
  checkUrl: (url) => {
    const urlR = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm;
    const isUrl = urlR.test(url);
    return isUrl;
  },
};

module.exports = validators;
