const generateCaseId = () => {
  const today = new Date();
  let year = today.getUTCFullYear();
  let month = today.getUTCMonth();
  let day = today.getUTCDate();
  day = (day < 9 ? "0" : "") + day;
  month = (month < 9 ? "0" : "") + month;
  return year + "-" + month + "-" + day;
};

module.exports.generateCaseId = generateCaseId;
