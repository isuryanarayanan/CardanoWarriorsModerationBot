const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { MessageEmbed } = require("discord.js");
const { dbGet, dbSaveSettings, dbSaveModerator} = require("../utils/db");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("appoint")
    .setDescription("Appoint a user for the moderation role")
    .addUserOption((option) =>
      option.setName("moderator").setDescription("Select moderator")
    )
    .addIntegerOption((options) =>
      options
        .setName("start")
        .setDescription("set start time in UTC hours (ex, 14 for 2 pm UTC) ")
    )
    .addIntegerOption((options) =>
      options
        .setName("stop")
        .setDescription("set stop time in UTC hours (ex, 15 for 3 pm UTC) ")
    )
    .addStringOption((options) =>
      options
        .setName("role")
        .setDescription("Select a role")
        .addChoice("Senior", "senior")
        .addChoice("Junior", "junior")
    ),
  async execute(interaction) {
    await interaction.reply("Adding moderator to program");

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
        await interaction.editReply("Moderator already in program");
      } else {
				await dbSaveModerator({
          user_id: interaction.options.getUser("moderator").id,
          user: interaction.options.getUser("moderator"),
          start: interaction.options.getInteger("start"),
          stop: interaction.options.getInteger("start"),
          role: interaction.options.getString("role"),
        });
        await interaction.editReply("Moderator added to program");
      }
    } else {
      await interaction.editReply("You are not authorized to use this command");
    }
  },
};
