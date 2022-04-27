const GUILD_ID = process.env["DEV_GUILD_ID"];
const {
  dbGet,
  dbSaveTicket,
  dbUpdateUser,
  dbSaveUser,
  dbRemoveUser,
} = require("../utils/db");

function createTag() {
  var tag = Math.floor(Math.random() * (10000 - 9 + 1) + 9);
  var tickets = dbGet({ collection: "tickets", find: { ticket_tag: tag } });

  if (tickets.length > 0) {
    tag = createTag();
  }

  return tag;
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
			channel_message:undefined,
      moderators: [],
      available_moderators: [],
      logs: "",
      closed: false,
      close_note: "",
    };

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
