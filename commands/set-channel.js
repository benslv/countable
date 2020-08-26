module.exports = {
	name: "set-channel",
	description: "Sets the ID of the counting channel to the ID provided by the user.",
	args: true,
	guildOnly: true,
	ownerOnly: true,
	usage: "<channel ID>",
	execute(message, args) {
		const guildConf = message.client.settings.get(message.guild.id);
		const guildChannels = message.guild.channels.cache;

		if (guildChannels.has(args[0])) {
			guildConf.countingChannelID = args[0];
			message.channel.send("The counting channel has been updated!");
		} else {
			message.channel.send(
				"I couldn't find that channel in this server. Make sure the ID is correct...",
			);
		}
	},
};
