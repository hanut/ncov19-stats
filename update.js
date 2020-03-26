const loadData = require("./lib/scraper").loadData;
const { firestore, Timestamp } = require("./lib/firebase");
const { generateCaseId } = require("./lib/utils");

(async () => {
  let data = await loadData();
  const caseId = generateCaseId();

  let doc = await firestore
    .collection("cases")
    .doc(caseId)
    .set({
      data,
      updatedAt: Timestamp.fromMillis(Date.now())
    });
})().catch(console.error);
