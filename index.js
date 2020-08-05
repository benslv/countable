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

	console.log(messageNumber);

	// Regex testing for a string being a number.
	const isNumber = (n) => /^\d+$/.test(n);

	// Delete the message if it doesn't start with a number.
	if (!isNumber(messageNumber)) {
		message.delete();
		return;
	}

	// Convert user input to a base-10 integer.
	messageNumber = parseInt(messageNumber, 10);

	// Check that the start of the message equals the expected count value.
	if (messageNumber !== config.currentCount) {
		message.channel.send("You did not enter the expected number!");
		config.currentCount = 1;
	} else {
		config.currentCount += 1;
		config.highestCount =
			messageNumber > config.highestCount ? messageNumber : config.highestCount;
	}
	console.log(config);
	fs.writeFile("config.json", JSON.stringify(config), (err) => console.error(err));
});

client.login(config.clientToken);
