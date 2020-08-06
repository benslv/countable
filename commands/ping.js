module.exports = {
	name: "ping",
	args: false,
	usage: "",
	guildOnly: false,
	ownerOnly: false,
	description: "Replies to the user to confirm the bot is running correctly!",
	execute(message, args) {
		message.channel.send(":ping_pong: **Pong!**");
	},
};
