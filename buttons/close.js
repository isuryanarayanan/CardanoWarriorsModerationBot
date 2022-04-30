const GUILD_ID = process.env["DEV_GUILD_ID"];
const { dbGet, dbUpdateTicket } = require("../utils/db");
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

async function closeTicket(interaction) {
  await interaction.reply({
    content: "Closing ticket ..",
    ephemeral: true,
  });

  var channel = await dbGet({
    collection: "tickets",
    find: { channel: interaction.channel.id },
  });

  if (channel.length > 0) {
    console.log(channel);
    await dbUpdateTicket(
      { ticket_tag: channel[0].ticket_tag },
      { closed: true, close_note: "closed" }
    );
		interaction.channel.delete()
  }
}

module.exports = {
  closeTicket,
};
