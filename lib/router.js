const { Router } = require("express");
var router = Router();
const { firestore, Timestamp } = require("../lib/firebase");

router.get("/by-day/:date", async ({ params: { date } }, res) => {
  let docRef = firestore.collection("cases").doc(caseId);
  let doc = await docRef.get();
  if (!doc.exists) {
    res.status(404).send();
    return;
  }
  let { data } = doc.data();
  res.json(data);
});

module.exports = router;
