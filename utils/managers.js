const GUILD_ID = process.env["DEV_GUILD_ID"];
const { dbGet } = require("./db");

async function dashboardManager(client) {
  var server = client.guilds.cache.get(GUILD_ID);

  // Load settings from db
  var settings = await dbGet({
    collection: "settings",
    find: { tag: "settings" },
  });

  var channel = server.channels.cache.get(settings[0].channels["dashboard"]);

  if (channel == undefined) {
    channel = await server.channels.create("dashboard-cwmb", {
      reason: "dashboard",
    });
  } else {
    console.log(channel);
  }
}
function ticketManager(client) {
  // if channel not created create channel
  //
  // if embed not send, send embed
}
function rankManager(client) {
  // if program has started the timer will
  // run every 5 mins to check if the reset
  // time has occured if occured the reputation points
  // will be reset to 0
}

module.exports = { dashboardManager, ticketManager, rankManager };
