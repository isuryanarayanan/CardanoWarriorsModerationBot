const GUILD_ID = process.env["DEV_GUILD_ID"];
const { dbGet, dbSaveSettings } = require("../../utils/db");

async function setupDashboardChannel(settings, server, client) {
  // Dashboard channel is where all the admin commands are used
  // Only people with a specific role can access these commands

  var dashboard_channel = server.channels.cache.get(
    settings[0].channels_dashboard
  );

  if (dashboard_channel == undefined) {
    // Creating dashboard channel if not found
    dashboard_channel = await server.channels.create("dashboard", {
      reason: "dashboard channel",
    });
    // Save new category into database
    await dbSaveSettings({
      channels_dashboard: dashboard_channel.id,
    });
  }

  // Setting permissions
  dashboard_channel.setParent(settings[0].category_dashboard);
}

module.exports = {
  setupDashboardChannel,
};
