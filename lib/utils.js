/**
 * Generates case ids based on date to ensure current date data is updated
 * and new entries are created
 */
const generateCaseId = () => {
  const today = new Date();
  let year = today.getUTCFullYear();
  let month = today.getUTCMonth();
  let day = today.getUTCDate();
  day = (day < 9 ? "0" : "") + day;
  month = (month < 9 ? "0" : "") + month;
  return year + "-" + month + "-" + day;
};

/**
 * Finds the countries with max and min deaths
 * 
 * @param {*} data - the case data for a single day 
 */
const getDeathMaxMin = data => {
  let deathMax = data.reduce(
    (acc, row) => (acc.deaths > row.deaths ? acc : row),
    data[0]
  );
  deathMax = { country: deathMax.country, deaths: deathMax.deaths };
  let deathMin = data.reduce(
    (acc, row) => (acc.deaths < row.deaths ? acc : row),
    data[0]
  );
  deathMin = { country: deathMin.country, deaths: deathMin.deaths };
  return { deathMax, deathMin };
};

/**
 * Calculates and returns the mortality index
 * for all the countries being tracked.
 * 
 * @param {*} data - the case data for a single day 
 */
const getMortIndex = data => {
  return data
    .map(({ country, recovered, deaths }) => {
      let total = recovered + deaths;
      return {
        country,
        rate: deaths > 0 && total > 0 ? (deaths / total).toFixed(2) : null
      };
    })
    .filter(row => row.rate)
    .sort((a, b) => (a.rate >= b.rate ? -1 : 1));
};

/**
 * Calculates and returns the recovery index
 * for all the countries being tracked.
 * 
 * @param {*} data - the case data for a single day 
 */
const getRecovIndex = data => {
  return data
    .map(({ country, deaths, recovered }) => {
      let total = recovered + deaths;
      return {
        country,
        rate: recovered > 0 && total > 0 ? (recovered / total).toFixed(2) : null
      };
    })
    .filter(row => row.rate)
    .sort((a, b) => (a.rate >= b.rate ? -1 : 1));
};

/**
 * Calculates the total active cases
 * 
 * @param {*} data - the case data for a single day 
 */
const getTotalActive = data => {
  return data.reduce((acc, row) => {
    return acc + row.active;
  }, 0);
}

module.exports.generateCaseId = generateCaseId;
module.exports.getDeathMaxMin = getDeathMaxMin;
module.exports.getMortIndex = getMortIndex;
module.exports.getRecovIndex = getRecovIndex;
module.exports.getTotalActive = getTotalActive;
