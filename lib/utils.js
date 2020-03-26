const generateCaseId = () => {
  const today = new Date();
  let year = today.getUTCFullYear();
  let month = today.getUTCMonth();
  let day = today.getUTCDate();
  day = (day < 9 ? "0" : "") + day;
  month = (month < 9 ? "0" : "") + month;
  return year + "-" + month + "-" + day;
};

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

module.exports.generateCaseId = generateCaseId;
module.exports.getDeathMaxMin = getDeathMaxMin;
module.exports.getMortIndex = getMortIndex;
module.exports.getRecovIndex = getRecovIndex;
