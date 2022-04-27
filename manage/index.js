const GUILD_ID = process.env["DEV_GUILD_ID"];
const {
  dbGet,
  dbSaveTicket,
  dbUpdateUser,
  dbSaveUser,
  dbRemoveUser,
} = require("../utils/db");
const { ticketManager } = require("./ticketManager");
const { setup } = require("../setup/index");

async function manage(client) {
  setInterval(async () => {
		setup(client);
    ticketManager(client);
	}, 10000);
}
module.exports = {
  manage,
};
