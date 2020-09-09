module.exports = {
	name: "brodd",
	description: "Resets the channel to just after the number given was counted.",
	args: true,
	guildOnly: true,
	ownerOnly: true,
	usage: "<number>",
	async execute(message, args) {
		// Regex testing for a string being a number.
		const isNumber = (n) => /^\d+$/.test(n);

		// Delete the message if it doesn't start with a number.
		if (!isNumber(args[0])) {
			return message.channel.send("I'm sorry, that's not a valid number.");
		}

		const countingChannel = await client.channels.fetch(guildSettings.countingChannelID);

		const messages = countingChannel.messages.fetch({limit: 50});
		
		const desiredState = messages.find((msg) => msg.content.startsWith(args[0]));

		if (desiredState === undefined) {
			return message.channel.send(
				`Failed to find message with number ${args[0]}`
			);
		}

		let cur = messages[0];
		while (cur !== desiredState) {
			cur.delete(1000);
		}

		message.client.settings.set(message.guild.id, parseInt(args[0], 10)+1, "nextCount");

		message.channel.send(
			`The count has been updated to ${message.client.settings.get(
				message.guild.id,
				"nextCount",
			)}`,
		);
	},
};
