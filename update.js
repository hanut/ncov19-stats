const loadData = require("./lib/scraper").loadData;
const { firestore, Timestamp } = require("./lib/firebase");
const { generateCaseId } = require("./lib/utils");

const Update = async () => {
  let data = await loadData();
  const caseId = generateCaseId();

  let doc = await firestore
    .collection("cases")
    .doc(caseId)
    .set({
      data,
      updatedAt: Timestamp.fromMillis(Date.now())
    });
};

if (require.main === module) {
  module.exports = Update;
} else {
  Update().catch(console.error);
}

