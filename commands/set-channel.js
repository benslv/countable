module.exports = {
	name: "set-channel",
	description: "Sets the ID of the counting channel to the ID provided by the user.",
	args: true,
	guildOnly: true,
	ownerOnly: true,
	usage: "<channel ID>",
	execute(message, args) {
		const guildConf = message.client.settings.get(message.guild.id);
		console.log(guildConf);
		guildConf.countingChannelID = args[0];

		console.log(guildConf);
		message.channel.send("The counting channel has been updated!");
	},
};
