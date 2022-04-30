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
      // Check if channel is created
      if (tickets[i].channel != undefined) {
        var server_channel = await server.channels.cache.get(
          tickets[i].channel
        ); // find that channel using the id
      }

      if (server_channel == undefined || tickets[i].channel == undefined) {
        // If neither the channel in database is found or nonexistent
        // create new channel and update db
        var ticket_channel = await server.channels.create(
          "ticket-" + tickets[i].ticket_tag,
          {
            reason: "ticket open channel",
          }
        );
        // Save new category into database
        await dbUpdateTicket(
          {
            ticket_tag: tickets[i].ticket_tag,
          },
          {
            channel: ticket_channel.id,
          }
        );
        ticket_channel.setParent(settings[0].category_ticket);
        server_channel = ticket_channel;
      }

      if (server_channel != undefined) {
        var message = undefined;

        if (tickets[i].channel_message != undefined) {
          await server_channel.messages
            .fetch(tickets[i].channel_message)
            .then((data) => {
              message = data;
            })
            .catch((err) => {
              if (err.message == "Unknown Message") {
                console.log(
                  "Ticket#" +
                    tickets[i].ticket_tag +
                    " : message not found, sending one..."
                );
              }
            });
        } else {
          await server_channel.messages
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
            .setDescription("Ticket created for @!suryan")
            .setTitle("Ticket#" + tickets[i].ticket_tag)
            .setTimestamp()
            .setFooter({ text: "Bot by !suryan" });

          const tickets_buttons = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId("ticket_close")
                .setLabel("Close")
                .setStyle("SUCCESS")
                .setEmoji("🎟")
            )
            .addComponents(
              new MessageButton()
                .setCustomId("moderation_apply")
                .setLabel("Claim")
                .setStyle("PRIMARY")
                .setEmoji("👷")
            );

          message = await server_channel.send({
            embeds: [tickets_embed],
            components: [tickets_buttons],
          });
          await dbUpdateTicket(
            { ticket_tag: tickets[i].ticket_tag },
            {
              channel_message: message.id,
            }
          );
        }
      }
    }
  }
}

module.exports = {
  ticketManager,
};
