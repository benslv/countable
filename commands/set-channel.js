module.exports = {
	name: "set-channel",
	description: "Sets the ID of the counting channel to the ID provided by the user.",
	args: true,
	guildOnly: true,
	ownerOnly: true,
	usage: "<channel ID>",
	execute(message, args) {
		message.channel.send("The counting channel has been updated!");
	},
};
