const serverless = require("serverless-http");
const express = require("express");
const app = express();
const { dbGet } = require("./db");

app.get("/", async (req, res, next) => {
  var tickets = await dbGet({ collection: "tickets", find: {} });
	return res.status(200).json(tickets);
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

module.exports.handler = serverless(app);
