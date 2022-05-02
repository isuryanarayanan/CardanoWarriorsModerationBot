require("dotenv").config();
const config = require("../config.json");
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

async function dbSaveSettings(content) {
  var dbClient = await dbConnect();
  try {
    await dbClient.connect();
    await dbClient
      .db("cwmoderationbot")
      .collection("settings")
      .updateOne({ tag: "settings" }, { $set: content });
  } catch (e) {
    console.error(e);
  } finally {
    await dbClient.close();
  }
}

async function dbSaveModerator(content) {
  var dbClient = await dbConnect();
  try {
    await dbClient.connect();
    await dbClient
      .db("cwmoderationbot")
      .collection("moderators")
      .insertOne(content);
  } catch (e) {
    console.error(e);
  } finally {
    await dbClient.close();
  }
}

async function dbRemoveModerator(content) {
  var dbClient = await dbConnect();
  try {
    await dbClient.connect();
    await dbClient
      .db("cwmoderationbot")
      .collection("moderators")
      .deleteOne(content);
  } catch (e) {
    console.error(e);
  } finally {
    await dbClient.close();
  }
}

async function dbSaveTicket(content) {
  var dbClient = await dbConnect();
  try {
    await dbClient.connect();
    await dbClient
      .db("cwmoderationbot")
      .collection("tickets")
      .insertOne(content);
  } catch (e) {
    console.error(e);
  } finally {
    await dbClient.close();
  }
}

async function dbUpdateTicket(query, content) {
  var dbClient = await dbConnect();
  try {
    await dbClient.connect();
    await dbClient
      .db("cwmoderationbot")
      .collection("tickets")
      .updateOne(query, { $set: content });
  } catch (e) {
    console.error(e);
  } finally {
    await dbClient.close();
  }
}

async function dbSaveUser(content) {
  var dbClient = await dbConnect();
  try {
    await dbClient.connect();
    await dbClient.db("cwmoderationbot").collection("users").insertOne(content);
  } catch (e) {
    console.error(e);
  } finally {
    await dbClient.close();
  }
}

async function dbUpdateUser(query, content) {
  var dbClient = await dbConnect();
  try {
    await dbClient.connect();
    await dbClient
      .db("cwmoderationbot")
      .collection("users")
      .updateOne(query, { $set: content });
  } catch (e) {
    console.error(e);
  } finally {
    await dbClient.close();
  }
}

async function dbRemoveUser(content) {
  var dbClient = await dbConnect();
  try {
    await dbClient.connect();
    await dbClient.db("cwmoderationbot").collection("users").deleteOne(content);
  } catch (e) {
    console.error(e);
  } finally {
    await dbClient.close();
  }
}

async function dbAddLog(content) {
  var dbClient = await dbConnect();
  try {
    await dbClient.connect();
    await dbClient
      .db("cwmoderationbot")
      .collection("logs-" + content.ticket_tag)
      .insertOne(content);
  } catch (e) {
    console.error(e);
  } finally {
    await dbClient.close();
  }
}

module.exports = {
  dbConnect,
  dbSaveSettings,
  dbGet,
  dbSaveModerator,
  dbRemoveModerator,
  dbSaveUser,
  dbUpdateUser,
  dbRemoveUser,
  dbSaveTicket,
  dbUpdateTicket,
  dbAddLog,
};
