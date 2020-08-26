module.exports = {
	name: "set-count",
	description: "Sets the value of nextCount the number provided by the user.",
	args: true,
	guildOnly: true,
	ownerOnly: true,
	usage: "<number>",
	execute(message, args) {
		const guildConf = message.client.settings.get(message.guild.id);
		console.log(guildConf);
		guildConf.countingChannelID = args[0];

		console.log(guildConf);
		message.channel.send("The counting channel has been updated!");
	},
};
