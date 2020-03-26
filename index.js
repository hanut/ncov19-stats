const { firestore, Timestamp } = require("./lib/firebase");
const { generateCaseId, getDeathMaxMin, getMortIndex, getRecovIndex } = require("./lib/utils");
const Update = require("./update");

(async () => {
  const caseId = generateCaseId();

  let docRef = firestore.collection("cases").doc(caseId);
  let doc = await docRef.get();
  if (!doc.exists) {
    await Update();
  }
  let { data } = doc.data();
  let {deathMax, deathMin} = getDeathMaxMin(data); 
  let mortIndex = getMortIndex(data);
  let recovIndex = getRecovIndex(data);
  let India = data.find(({country}) => country === 'India');
  console.log(India)
})().catch(console.error);
