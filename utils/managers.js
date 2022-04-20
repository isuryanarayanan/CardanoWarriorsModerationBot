const GUILD_ID = process.env["DEV_GUILD_ID"];
const {
  dbGet,
  dbSaveTicket,
  dbUpdateUser,
  dbSaveUser,
  dbRemoveUser,
} = require("./db");

async function manage(client) {}

function createTag() {
  var tag = Math.floor(Math.random() * (10000 - 9 + 1) + 9);
  var tickets = dbGet({ collection: "tickets", find: { ticket_tag: tag } });

  if (tickets.length > 0) {
    tag = createTag();
  }

  return tag;
}

async function ticketManager(interaction) {
  await interaction.reply({
    content: "Creating ticket ..",
    ephemeral: true,
  });

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
    var ticket = {
      opener: interaction.user.id,
      ticket_tag: createTag(),
      time: 0,
      channel: undefined,
      moderators: [],
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
          user_id: existing_user[0].user_id,
          user: existing_user[0].user,
          banned: false,
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
  ticketManager,
  manage,
};
