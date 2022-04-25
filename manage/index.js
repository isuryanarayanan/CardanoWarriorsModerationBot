const GUILD_ID = process.env["DEV_GUILD_ID"];
const {
  dbGet,
  dbSaveTicket,
  dbUpdateUser,
  dbSaveUser,
  dbRemoveUser,
} = require("../utils/db");

async function manage(client) {
  setInterval(async () => {


    
  }, 60000);
}
module.exports = {
  manage,
};
