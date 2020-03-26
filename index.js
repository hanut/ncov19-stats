const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const morgan = require("morgan");
const router = require('./lib/router');
const PORT = process.env.NCOV_19_PORT || 3001;

/**
 * Middleware section
 */
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

/**
 * Routing
 */
app.get("/health", (req, res) => res.send("ok"))
app.use('/api', router);

/**
 * Begin listening
 */
app.listen(PORT, () => console.log(`nCov-19-Tracker listening on ${PORT}!`));
