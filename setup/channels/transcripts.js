const GUILD_ID = process.env["DEV_GUILD_ID"];
const { dbGet, dbSaveSettings } = require("../../utils/db");

async function setupTranscriptsChannel(settings, server, client) {
  // Transcripts channel is where all the session transcripts are
  // displayed or archived

  var transcripts_channel = server.channels.cache.get(
    settings[0].channels_transcripts
  );

  if (transcripts_channel == undefined) {
    // Creating transcripts channel if not found
    transcripts_channel = await server.channels.create("transcripts", {
      reason: "transcripts channel",
    });
    // Save new category into database
    await dbSaveSettings({
      channels_transcripts: transcripts_channel.id,
    });
  }

  // Setting permissions
  transcripts_channel.setParent(settings[0].category_dashboard);
}



module.exports = {
  setupTranscriptsChannel,
};
