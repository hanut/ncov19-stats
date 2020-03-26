const admin = require("firebase-admin");
const key = require("./firebase.key.json");

admin.initializeApp({ credential: admin.credential.cert(key) });

const firestore = admin.firestore();
const Timestamp = admin.firestore.Timestamp;

module.exports = { firestore, Timestamp };
