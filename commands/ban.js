const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { dbGet, dbSaveSettings, dbUpdateUser } = require("../utils/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the moderation program")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select user")
    ),
  async execute(interaction) {
    await interaction.reply("Banning user from program");

    var settings = await dbGet({
      collection: "settings",
      find: { tag: "settings" },
    });

    if (settings[0].channels_dashboard == interaction.channel.id) {
      var existing_user = await dbGet({
        collection: "users",
        find: {
          user_id: interaction.options.getUser("user").id,
          banned: false,
        },
      });

      if (existing_user.length > 0) {
        await dbUpdateUser(
          {
            user_id: interaction.options.getUser("user").id,
          },
          { banned: true }
        );
        await interaction.editReply("User banned from program");
      } else {
        await interaction.editReply("User not in program or already banned");
      }
    } else {
      await interaction.editReply("You are not authorized to use this command");
    }
  },
};
