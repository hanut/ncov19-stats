const { firestore, Timestamp } = require("./lib/firebase");
const { generateCaseId } = require("./lib/utils");

(async () => {
  const caseId = generateCaseId();

  let docRef = firestore.collection("cases").doc(caseId);
  let doc = await docRef.get();
  if (!doc.exists) {
    throw new Error("No data found for today. Please run the update script");
  }
  let { data } = doc.data();
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
  let mortIndex = data
    .map(({ country, recovered, deaths }) => {
      let total = recovered + deaths;
      return {
        country,
        rate: deaths > 0 && total > 0 ? (deaths / total).toFixed(2) : null
      };
    })
    .filter(row => row.rate)
    .sort((a, b) => (a.rate >= b.rate ? -1 : 1));
  let recovIndex = data
    .map(({ country, deaths, recovered }) => {
      let total = recovered + deaths;
      return {
        country,
        rate: recovered > 0 && total > 0 ? (recovered / total).toFixed(2) : null
      };
    })
    .filter(row => row.rate)
    .sort((a, b) => (a.rate >= b.rate ? -1 : 1));
  console.log(
    `Maximum deaths in ${deathMax.country} where the count is ${deathMax.deaths}`
  );
  console.log(
    `Minimum deaths in ${deathMin.country} where the count is ${deathMin.deaths}`
  );
  console.log("Mortality index is - ");
  console.table(mortIndex);
  console.log("Recovery index is - ");
  console.table(recovIndex);
})().catch(console.error);
