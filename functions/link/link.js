const { GoogleSpreadsheet } = require("google-spreadsheet");
const credentials = require("../cseh-db6c9c2f2cc2.json");
const sheetId = "1Rvvs-1Q4w4B5rq4LeyrCJcrVpBloTcgB3FEw4lUhOy8";
exports.handler = async (event, context) => {
  const { inputLink } = event.queryStringParameters;
  console.log(inputLink);
  try {
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    const sheet = doc.sheetsById[0];
    const rows = await sheet.getRows();
    if (inputLink) {
      rows[0]["pqt-class-link"] = inputLink;
      await rows[0].save();
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "success",
          data: "",
        }),
      };
    }
    const link = rows[0]["pqt-class-link"];
    if (link)
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "success",
          data: link,
        }),
      };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 502,
      body: JSON.stringify({
        message: error.message || "internal server error",
        data: "",
      }),
    };
  }
};
