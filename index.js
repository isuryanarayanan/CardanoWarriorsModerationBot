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
 */

const { Client, Collection, Intents } = require("discord.js");
const { createTicket } = require("./buttons/create");
const { closeTicket } = require("./buttons/close");
const { manage } = require("./manage/index");
const { logsManager } = require("./manage/logsManager");
const { setup } = require("./setup/index");
const { publishCommands } = require("./utils/publishCommands");
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});
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

client.once("ready", async () => {
  client.user.setActivity("/help");

  // Publishes commands to the bot
  await publishCommands();

  // Sets up the bot
  await setup(client);

  // Manages the state every 5 minutes
  manage(client);

  console.log("Connection to bot established, running executables ..");
});

// Used for ticket channels mainly
client.on("messageCreate", (message) => {
  var server = client.guilds.cache.get(GUILD_ID);
  var message_channel = server.channels.cache.get(message.channelId);
  if (message_channel.name.startsWith("ticket-")) {
    logsManager(message, message_channel);
  }
});

// Slash command interactions
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

// Button interactions
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId == "ticket_open") {
    try {
      await createTicket(interaction);
    } catch (error) {
      console.log(error);
      await interaction.editReply("Uh. oh!");
    }
  } else if (interaction.customId == "ticket_close") {
    try {
      await closeTicket(interaction);
    } catch (error) {
      console.log(error);
      await interaction.editReply("Uh. oh!");
    }
  } else {
    await interaction.reply({
      content: "Uh. oh! Interaction not valid.",
      ephemeral: true,
    });
  }
});

client.login(BOT_TOKEN);
