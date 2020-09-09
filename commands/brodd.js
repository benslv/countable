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
		
		// Get the channel, and the 50 most recent messages
		const countingChannel = await client.channels.fetch(guildSettings.countingChannelID);
		const messages = await countingChannel.messages.fetch({limit: 50});
		
		// Find the last message with the given count
		const desiredState = messages.find((msg) => msg.content.startsWith(args[0]));

		// If such a message wasn't found, return an error message
		if (desiredState === undefined) {
			return message.channel.send(
				`Failed to find message with number ${args[0]}!`
			);
		}

		// Delete all messages since the desired message
		let cur = 0, curMsg = messages[cur];
		while (curMsg !== desiredState) {
			curMsg.delete(1000)
				.catch(`Failed to delete message '${curMsg.content}'!`);
			
			cur++;
			curMsg = messages[cur];
		}

		// Set nextCount and respond to the command
		message.client.settings.set(message.guild.id, parseInt(args[0], 10)+1, "nextCount");

		message.channel.send(
			`The count has been updated to ${message.client.settings.get(
				message.guild.id,
				"nextCount",
			)}`,
		);
	},
};
