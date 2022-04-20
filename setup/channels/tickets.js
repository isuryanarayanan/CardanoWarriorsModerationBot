const GUILD_ID = process.env["DEV_GUILD_ID"];
const { dbGet, dbSaveSettings } = require("../../utils/db");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

async function setupTicketsChannel(settings, server, client) {
  // Tickets channel is where all the conversations take place
  // everyone have access to this

  var tickets_channel = server.channels.cache.get(settings[0].channels_tickets);

  if (tickets_channel == undefined) {
    // Creating tickets channel if not found
    tickets_channel = await server.channels.create("tickets", {
      reason: "tickets channel",
    });
    // Save new category into database
    await dbSaveSettings({
      channels_tickets: tickets_channel.id,
    });
  }

  var message = undefined;

  if (settings[0].channels_tickets_handler) {
    await tickets_channel.messages
      .fetch(settings[0].channels_tickets_handler)
      .then((data) => {
        message = data;
      })
      .catch((err) => {
        if (err.message == "Unknown Message") {
          console.log("Tickets: genesis message not found, sending one...");
        }
      });
  } else {
    await tickets_channel.messages
      .fetch()
      .then((data) => {
        data.forEach((e) => {
          if (e.author.id == CLIENT_ID) {
            message = e;
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

	if (!message) {
    const tickets_embed = new MessageEmbed();

    tickets_embed
      .setColor("#0099ff")
      .setDescription(
				"Need help for transaction purposes, website or game issues? Do you feel like you need to contact a moderator? Open a ticket for any support issues!\n\n**__Active Moderators__**\n\n ```Junior moderator 🧑‍🏭 , Senior moderator 👷```\n_ _ "
      )
      .setTitle("Open a ticket")
      .setTimestamp()
      .setFooter({ text: "Bot by !suryan" })
			.addField("> 👷 150 pts", "> ```suryan#1212```",true)
			.addField("> 👷 130 pts", "> ```suryan#1212```",true)
			.addField("> 🧑‍🏭  99 pts", "> ```suryan#1212```",true)

    const tickets_buttons = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("ticket_open")
          .setLabel("Open a ticket")
          .setStyle("SUCCESS")
          .setEmoji("🎟")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("moderation_apply")
          .setLabel("Become a moderator")
          .setStyle("PRIMARY")
          .setEmoji("👷")
      );

    message = await tickets_channel.send({
      embeds: [tickets_embed],
      components: [tickets_buttons],
    });
    await dbSaveSettings({
      channels_tickets_handler: message.id,
    });
  }

  // Setting permissions
  tickets_channel.setParent(settings[0].category_ticket);
}

module.exports = {
  setupTicketsChannel,
};
