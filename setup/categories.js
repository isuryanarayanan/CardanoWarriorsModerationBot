const GUILD_ID = process.env["DEV_GUILD_ID"];
const { dbGet, dbSaveSettings } = require("../utils/db");

async function setupDashboardCategory(settings, server, client) {
  // Dashboard category is where all the admin stuff is
  // like transcripts and the channel to apply admin commands to
  // Only people with a specific role can access these commands
  // and channels

  var category = server.channels.cache.get(settings[0].category_dashboard);

  if (category == undefined) {
    // Creating dashboard category if not found
    category = await server.channels.create("dashboard-cwmb", {
      reason: "dashboard",
      type: "GUILD_CATEGORY",
    });
    // Save new category into database
    await dbSaveSettings({
      category_dashboard: category.id,
    });
  }

  // Setting permissions
  category.permissionOverwrites.create(category.guild.roles.everyone, {
    VIEW_CHANNEL: false,
  });
	
}

async function setupTicketCategory(settings, server, client) {
  // Ticket category is where all the public stuff is
  // like ticket creation and the private channel  are
  // Only people with a specific role can access these channels
  // mainly the moderators, the team and the ticket opener

  var category = server.channels.cache.get(settings[0].category_ticket);

  if (category == undefined) {
    // Creating dashboard category if not found
    category = await server.channels.create("tickets-cwmb", {
      reason: "ticket",
      type: "GUILD_CATEGORY",
    });
    // Save new category into database
    await dbSaveSettings({
      category_ticket: category.id,
    });
  }

  // Setting permissions
  category.permissionOverwrites.create(category.guild.roles.everyone, {
		VIEW_CHANNEL: false,
  });
}

module.exports = {
  setupTicketCategory,
  setupDashboardCategory,
};
