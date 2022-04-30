const GUILD_ID = process.env["DEV_GUILD_ID"];
const {
  dbGet,
  dbSaveTicket,
  dbUpdateUser,
  dbSaveUser,
  dbRemoveUser,
} = require("../utils/db");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

function createTag() {
  var tag = Math.floor(Math.random() * (10000 - 9 + 1) + 9);
  var tickets = dbGet({ collection: "tickets", find: { ticket_tag: tag } });

  if (tickets.length > 0) {
    tag = createTag();
  }

  return tag;
}

async function manageTicket(ticket, interaction) {
  var server = interaction.client.guilds.cache.get(GUILD_ID);
  var settings = await dbGet({
    collection: "settings",
    find: { tag: "settings" },
  });
  if (!ticket.closed) {
    var ticket_channel = await server.channels.create(
      "ticket-" + ticket.ticket_tag,
      {
        reason: "ticket open channel",
      }
    );
    ticket.channel = ticket_channel.id;

    const tickets_embed = new MessageEmbed();

    tickets_embed
      .setColor("#0099ff")
      .setDescription("Ticket created for @!suryan")
      .setTitle("Ticket#" + ticket.ticket_tag)
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

    message = await ticket_channel.send({
      embeds: [tickets_embed],
      components: [tickets_buttons],
    });
    ticket.channel_message = message.id;
    ticket_channel.setParent(settings[0].category_ticket);
  }

  return ticket;
}

async function createTicket(interaction) {
  await interaction.reply({
    content: "Creating ticket ..",
    ephemeral: true,
  });

  // Checking if user is eligible to use ticket service
  var users = await dbGet({
    collection: "users",
    find: { user_id: interaction.user.id, banned: true },
  });

  if (users.length > 0) {
    await interaction.editReply({
      content: "Ticket creation for this user is not authorized",
      ephemeral: true,
    });
  } else {
    // Creating the ticket
    const d = new Date();
    var ticket = {
      opener: interaction.user.id,
      ticket_tag: createTag(),
      time: d.getUTCHours(),
      date: d,
      channel: undefined,
      channel_message: undefined,
      moderators: [],
      available_moderators: [],
      logs: "",
      closed: false,
      close_note: "",
    };

    ticket = await manageTicket(ticket, interaction);
    var saved_ticket = await dbSaveTicket(ticket);

    await interaction.editReply({
      content: "Ticket Created ",
      ephemeral: true,
    });

    var existing_user = await dbGet({
      collection: "users",
      find: { user_id: interaction.user.id },
    });

    if (existing_user.length > 0) {
      await dbUpdateUser(
        {
          user_id: interaction.user.id,
        },
        {
          tickets: existing_user[0].tickets.concat([ticket]),
        }
      );
    } else {
      await dbSaveUser({
        user_id: interaction.user.id,
        user: interaction.user,
        banned: false,
        tickets: [],
      });
    }
  }
}

module.exports = {
  createTicket,
};
