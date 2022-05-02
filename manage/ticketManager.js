const GUILD_ID = process.env["DEV_GUILD_ID"];
const CLIENT_ID = process.env["DEV_CLIENT_ID"];
const { dbGet, dbUpdateTicket } = require("../utils/db");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

async function ticketManager(client) {
  var server = client.guilds.cache.get(GUILD_ID);
  var tickets = await dbGet({
    collection: "tickets",
    find: {},
  });
  var settings = await dbGet({
    collection: "settings",
    find: { tag: "settings" },
  });

  for (var i = 0; i < tickets.length; i++) {
    if (tickets[i].closed) {
      // If ticket is closed in database
      if (tickets[i].channel != undefined) {
        // If the database still have the channel id
        var server_channel = await server.channels.cache.get(
          tickets[i].channel
        ); // find that channel using the id
        if (server_channel != undefined) {
          server_channel.delete(); // Then delete it
        }
        // And update the database
        await dbUpdateTicket(
          { ticket_tag: tickets[i].ticket_tag },
          { channel: undefined }
        );
      }
    } else {
      // Update the server if the channel is deleted
      var server_channel = await server.channels.cache.get(tickets[i].channel);

      if (server_channel == undefined) {
        await dbUpdateTicket(
          { ticket_tag: tickets[i].ticket_tag },
          { closed: true, close_note: "channel deleted" }
        );
      }
    }
  }
}

module.exports = {
  ticketManager,
};
