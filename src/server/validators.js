const validators = {
  /**
   * Check required fields
   * @param {*} query parameters passed as query string
   * @return {boolean} true when all required fields have been provided
   */
  checkRequiredFields: (query) => {
    return query.country && query.countryCode &&
      query.city && query.travelDate;
  },
  /**
   * Check for valid date
   * @param {*} date
   * @return {boolean} true when date is valid
   */
  isValidDate: (date) => {
    const dateR =
    /^([0-9]{4})(-?)(1[0-2]|0[1-9])\2(3[01]|0[1-9]|[12][0-9])$/gm;
    const isDate = dateR.test(date);
    return isDate;
  },
};

module.exports = validators;
