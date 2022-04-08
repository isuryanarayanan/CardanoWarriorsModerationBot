require("dotenv").config();
/*
 *
 * The CardanoWarriors discord community moderation bot
 * __________________________
 *
 * Intents to create a ticketing bot that has a rating system tailor made to
 * fit the CardanoWarriors moderation program.
 *
 * The moderation program.
 * __________________________
 *
 * There will be community members selected to be moderators for the discord
 * community and there will be a rating system working alongside the usual banter.
 *
 * The moderators are divided into two roles
 *
 * - Senior moderator
 * - Junior moderator
 *
 * Senior moderators will have a higher reputation based on their history in moderation.
 * Junior developers will have some reputation enough to keep them in the program.If the
 * threshold is not kept due to bad rating then they will be terminated from the program,
 * and for senior moderators they will be demoted to junior moderators.
 *
 * These points are dynamically set by the admin.
 *
 *
 * The Ticketing system
 * __________________________
 *
 * There will be a channel created by the bot and have an embed which the users can interact
 * with. Upon interaction the bot will open a channel with the user, the team and the available
 * moderator at that time. The messages inside this channel is recorded and saved into a mongoDB
 * instance. On closing the channel there will be a prompt for moderator and the users to provide
 * feedback on the experience with each other.
 *
 * There will be also another channel called transcripts which will be only available to the team
 * where the logs are shared.
 *
 *
 * The administration panel
 * __________________________
 *
 * The bot will create a channel called "administration" where the admin commands are accessible
 * for the team. Here the admins can set parameters on which the bot operates on. Here they can
 *
 * - add moderators
 * - set reputation points
 * - see logs
 * - control who has access to the program
 * - reset the program
 *
 *
 */

const { Client, Collection, Intents } = require("discord.js");
const { rankManager, ticketManager, dashboardManager } = require("./managers");
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
const fs = require("fs");

const GUILD_ID = process.env["DEV_GUILD_ID"];
const BOT_TOKEN = process.env["DEV_BOT_TOKEN"];

// Creating command collection
// Each file under the commands folder
// with a .js extention will be deployed as a command
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

client.commands = new Collection();

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

client.once("ready", () => {
  client.user.setActivity("/help");

	dashboardManager(client);
  ticketManager(client);
	rankManager(client);

  console.log("Ready");
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.log(error);
    await interaction.editReply("Uh. oh!");
  }
});

client.login(BOT_TOKEN);
