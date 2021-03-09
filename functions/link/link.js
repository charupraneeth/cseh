const fs = require("fs");
const path = require("path");
exports.handler = async (event, context) => {
  try {
    if (!event.queryStringParameters.link) {
      const link = await fs.promises.readFile(
        path.join(__dirname, "link.txt"),
        {
          encoding: "utf-8",
        }
      );
      if (link) {
        console.log(link);
        return {
          statusCode: 200,
          body: link,
        };
      }
    } else {
      if (event.queryStringParameters.link == ", ") {
        return {
          statusCode: 401,
          body: "invalid",
        };
      }
      const link = await fs.promises.writeFile(
        path.join(__dirname, "link.txt"),
        event.queryStringParameters.link
      );
      return {
        statusCode: 200,
        body: "updated",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: error.message || "error reading file",
    };
  }
};
