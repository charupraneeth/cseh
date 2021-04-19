const { GoogleSpreadsheet } = require("google-spreadsheet");
const credentials = require("./service-account.json"); // load your service account here

// your google sheet id
// if the google sheet link is https://docs.google.com/spreadsheets/d/L98bhyT89rpaigXdeW44x1EZb-4M43teKT2QGPnI7b3Y/edit#gid=0
// L98bhyT89rpaigXdeW44x1EZb-4M43teKT2QGPnI7b3Y is the required id

const sheetId = process.env.GOOGLE_SHEET_ID; // set this variable in a .env file
exports.handler = async (event, context) => {
  const { inputLink } = event.queryStringParameters;
  console.log(inputLink);
  try {
    const doc = new GoogleSpreadsheet(sheetId);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    const sheet = doc.sheetsById[0];
    const rows = await sheet.getRows();

    // update the previous link in the sheets
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

    // respond with saved link
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
