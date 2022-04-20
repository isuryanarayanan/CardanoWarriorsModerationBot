const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { dbGet, dbSaveSettings, dbRemoveModerator} = require("../utils/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("terminate")
    .setDescription("Terminate a user from the moderation program")
    .addUserOption((option) =>
      option.setName("moderator").setDescription("Select moderator")
    ),
  async execute(interaction) {
    await interaction.reply("Removing moderator to program");

    var settings = await dbGet({
      collection: "settings",
      find: { tag: "settings" },
    });

    if (settings[0].channels_dashboard == interaction.channel.id) {
      var existing_user = await dbGet({
        collection: "moderators",
        find: { user: interaction.options.getUser("moderator") },
      });

      if (existing_user.length > 0) {
        await interaction.editReply("Removing moderator");

        dbRemoveModerator({
          user_id: interaction.options.getUser("moderator").id,
        });

        await interaction.editReply("Moderator removed");
      } else {
        await interaction.editReply("No moderator found");
      }
    } else {
      await interaction.editReply("You are not authorized to use this command");
    }
  },
};
