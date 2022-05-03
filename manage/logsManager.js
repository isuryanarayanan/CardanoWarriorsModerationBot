const GUILD_ID = process.env["DEV_GUILD_ID"];
const CLIENT_ID = process.env["DEV_CLIENT_ID"];
const { dbGet, dbAddLog } = require("../utils/db");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

async function logsManager(message, channel) {
  var ticket = await dbGet({
    collection: "tickets",
    find: { channel: channel.id },
  });

  var log = {
    ticket_tag: ticket[0].ticket_tag,
    channel: channel.id,
    content: message.content,
    author: message.author,
		attachments: message.attachments,
    time: message.createdTimestamp,
  };

  await dbAddLog(log);
}

module.exports = {
  logsManager,
};
