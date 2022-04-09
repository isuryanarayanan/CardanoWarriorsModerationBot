/*
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
 */

function ticket(client) {}

module.exports = { ticket };
