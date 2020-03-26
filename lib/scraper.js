const Cheerio = require("cheerio");
const needle = require("needle");
const fs = require("fs").promises;
const DS = require("path").DS;

const SAVE_FILE_PATH = "data.cache";

const loadData = async () => {
  let fileData = await loadFromFile();
  if (fileData) {
    return fileData;
  }
  const { body } = await needle(
    "get",
    "https://www.worldometers.info/coronavirus/"
  );
  let $ = Cheerio.load(body);
  let data = [];
  $("#main_table_countries_today tbody")
    .find("tr")
    .each((i, row) => {
      let rowData = {};
      $(row)
        .children()
        .each((j, data) => {
          if (j === 0) {
            rowData["country"] = $(data).text();
          } else if (j === 1) {
            rowData["total"] =
              parseFloat(
                $(data)
                  .text()
                  .replace(/,/g, "")
              ) || 0;
          } else if (j === 2) {
            rowData["newCases"] =
              parseFloat(
                $(data)
                  .text()
                  .replace(/,/g, "")
              ) || 0;
          } else if (j === 3) {
            rowData["deaths"] =
              parseFloat(
                $(data)
                  .text()
                  .replace(/,/g, "")
              ) || 0;
          } else if (j === 4) {
            rowData["newDeaths"] =
              parseFloat(
                $(data)
                  .text()
                  .replace(/,/g, "")
              ) || 0;
          } else if (j === 5) {
            rowData["recovered"] =
              parseFloat(
                $(data)
                  .text()
                  .replace(/,/g, "")
              ) || 0;
          } else if (j === 6) {
            rowData["active"] =
              parseFloat(
                $(data)
                  .text()
                  .replace(/,/g, "")
              ) || 0;
          } else if (j === 7) {
            rowData["serious"] =
              parseFloat(
                $(data)
                  .text()
                  .replace(/,/g, "")
              ) || 0;
          } else if (j === 8) {
            rowData["c1m"] =
              parseFloat(
                $(data)
                  .text()
                  .replace(/,/g, "")
              ) || 0;
          } else if (j === 9) {
            rowData["d1m"] =
              parseFloat(
                $(data)
                  .text()
                  .replace(/,/g, "")
              ) || 0;
          }
        });
      data.push(rowData);
    });
  data = data.filter(i => i.country !== "Total:");
  await saveToFile(data);
  return data;
};

const saveToFile = async data => {
  await fs.writeFile(SAVE_FILE_PATH, JSON.stringify(data), {
    flag: "w+"
  });
};

const loadFromFile = async () => {
  try {
    const { mtimeMs } = await fs.lstat(SAVE_FILE_PATH);
    const elapsed = Math.round((Date.now() - mtimeMs) / (1000 * 60 * 60));

    // Check if the cache file has expired and return false if it has
    if (elapsed >= 1) {
      return false;
    }
    // Read the raw file, parse the contents to JSON
    // and return the data
    let data = await fs.readFile(SAVE_FILE_PATH);
    data = JSON.parse(data.toString());
    return data;
  } catch (error) {
    if (error.errno === -2) {
      return false;
    } else if (error.message === "Unexpected end of JSON input") {
      return false;
    } else if (error.message.indexOf("JSON") !== -1) {
      return false;
    }
    throw error;
  }
};

module.exports = { loadData };
