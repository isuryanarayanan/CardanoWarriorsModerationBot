require("dotenv").config();
const config = require("./config.json");
const { MongoClient } = require("mongodb");

async function dbConnect(run) {
  const DB_USERNAME = process.env["DB_USERNAME"];
  const DB_PASSWORD = process.env["DB_PASSWORD"];
  const DB_DATABASE = process.env["DB_DATABASE"];
  const DB_CLUSTER = process.env["DB_CLUSTER"];

  var uri = "";
  uri = config.mongodb.url;
  uri = uri.replace("<username>", DB_USERNAME);
  uri = uri.replace("<password>", DB_PASSWORD);
  uri = uri.replace("<database>", DB_DATABASE);
  uri = uri.replace("<cluster>", DB_CLUSTER);

  const client = new MongoClient(uri);
  return client;
}

async function dbGet(filters) {
  var result;
  var dbClient = await dbConnect();
  try {
    await dbClient.connect();
    result = await dbClient
      .db("cwmoderationbot")
      .collection(filters.collection)
      .find(filters.find)
      .toArray();
  } catch (e) {
    console.error(e);
  } finally {
    await dbClient.close();
  }
  return result;
}

module.exports = {
  dbConnect,
  dbGet,
};
