const GUILD_ID = process.env["DEV_GUILD_ID"];
const { dbGet, dbSaveSettings } = require("../utils/db");

const { setupDashboardCategory, setupTicketCategory } = require("./categories");
const { setupDashboardChannel } = require("./channels/dashboard");
const { setupTranscriptsChannel } = require("./channels/transcripts");
const { setupTicketsChannel } = require("./channels/tickets");

async function setup(client) {
  var server = client.guilds.cache.get(GUILD_ID);

  // Getting settings from database
  var settings = await dbGet({
    collection: "settings",
    find: { tag: "settings" },
  });

  // Categories
  await setupDashboardCategory(settings, server, client);
  await setupTicketCategory(settings, server, client);

  settings = await dbGet({
    collection: "settings",
    find: { tag: "settings" },
  });

  // Channels
  setupDashboardChannel(settings, server, client);
  setupTranscriptsChannel(settings, server, client);
  setupTicketsChannel(settings, server, client);
}

module.exports = {
  setup,
};
