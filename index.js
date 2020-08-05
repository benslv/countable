const fs = require("fs");

const Discord = require("discord.js");
const client = new Discord.Client();

const config = require("./config.json");

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
	// Will not respond to the message if it's from a bot or isn't in the correct channel.
	if (message.author.bot) return;
	if (message.channel.id !== config.countingChannel) return;

	// Split the message up into parts.
	messageSplit = message.content.split(" ");
	messageNumber = messageSplit[0];

	// Regex testing for a string being a number.
	const isNumber = (n) => /^\d+$/.test(n);

	// Delete the message if it doesn't start with a number.
	if (!isNumber(messageNumber)) {
		message.delete();
		return;
	}

	// Convert user input to a base-10 integer.
	messageNumber = parseInt(messageNumber, 10);

	// Compare the author id of the current message to that of the previous message sent.
	if (message.author.id === config.prevUserId) {
		message.delete().catch((err) => console.error(err));
		return;
	} else {
		// Store the id of the user to prevent consecutive entries by the same user.
		config.prevUserId = message.author.id;
	}

	// Check that the start of the message equals the expected count value.
	if (messageNumber !== config.nextCount) {
		message.channel.send("You did not enter the expected number!");
		config.nextCount = 1;

		message.channel.messages
			.fetch(config.highestMessageId)
			.then((message) => {
				if (!message.pinned) message.pin().catch((err) => console.error(err));
			})
			.catch((err) => console.error(err));
	} else {
		config.nextCount += 1;

		// Update the highest score for the server, to keep track of when to pin.
		if (messageNumber > config.highestCount) {
			config.highestCount = messageNumber;

			// Store the id of the new highest message.
			config.highestMessageId = message.id;
		}
	}
	fs.writeFile("config.json", JSON.stringify(config), () =>
		console.log("Successfully saved data!"),
	);
});

client.login(config.clientToken);
