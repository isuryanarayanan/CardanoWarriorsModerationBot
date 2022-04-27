const GUILD_ID = process.env["DEV_GUILD_ID"];
const { dbGet, dbUpdateTicket } = require("../utils/db");

function timeAgo(date) {
  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const interval = intervals.find((i) => i.seconds < seconds);
  const count = Math.floor(seconds / interval.seconds);
  return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
}

async function ticketManager(client) {
  var server = client.guilds.cache.get(GUILD_ID);
  var tickets = await dbGet({
    collection: "tickets",
    find: {},
  });
  var settings = await dbGet({
    collection: "settings",
    find: { tag: "settings" },
  });
  for (var i = 0; i < tickets.length; i++) {
    if (tickets[i].closed) {
			// Ticket is closed
			//
      // Check if channel is deleted else delete it.
      if (tickets[i].channel != undefined) {
        var channel = await server.channels.cache.get(tickets[i].channel);
        if (channel != undefined) {
          // Delete channel
          channel.delete();
        }
        // update ticket
        await dbUpdateTicket(
          { tag: tickets[i].ticket_tag },
          { channel: undefined }
        );
      }

			// Send logs to transcripts channel
    } else {
			// Ticket is still open 

      // check if tickets should be closed by expiry
      var time_delay = (new Date() - tickets[i].date) / (1000 * 60 * 60);
      if (time_delay > 24.0) {
        await dbUpdateTicket(
					{ ticket_tag: tickets[i].ticket_tag },
          { closed: true, close_note: "Time expired" }
        );
      } else {
        // Create channel for the ticket
        if (tickets[i].channel == undefined) {
          ticket_channel = await server.channels.create(
            "ticket-" + tickets[i].ticket_tag,
            {
              reason: "ticket open channel",
            }
          );
          // Save new category into database
          await dbUpdateTicket(
            {
              ticket_tag: tickets[i].ticket_tag,
            },
            {
              channel: ticket_channel.id,
            }
          );
          ticket_channel.setParent(settings[0].category_ticket);
        }

				// Send channel message
				if(tickets[i].channel_message == undefined){

				}
      }
    }
  }
}

module.exports = {
  ticketManager,
};
