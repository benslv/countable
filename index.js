// Config containing bot token and prefix.
const config = require("./config.json");
const { CLIENT_ID, CLIENT_TOKEN } = config;

const Discord = require("discord.js");
const client = new Discord.Client();

const fs = require("fs");

const Enmap = require("enmap");

client.settings = new Enmap({
	name: "settings",
	fetchAll: false,
	autoFetch: true,
	cloneLevel: "deep",
});

const defaultSettings = {
	prefix: "`",
	countingChannelID: "",
	nextCount: 1,
	highestCount: 0,
	highestMessageID: "",
	prevUserID: "",
	latestMessageTimestamp: "",
};

// Create a new collection to store the bot's commands.
client.commands = new Discord.Collection();

// Filter out any files that aren't `.js` files.
const commandFiles = fs.readdirSync("./commands").filter((file) => file.endsWith(".js"));

// Iterate through the list of available commands and add them all to the commands Collection.
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.on("ready", () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
	// Will not respond to the message if it's from a bot or isn't a guild message.
	if (!message.guild || message.author.bot) return;

	// Attempt to retrieve the settings for the current server, otherwise loading a copy of the
	// default settings.
	const guildSettings = client.settings.ensure(message.guild.id, defaultSettings);

	// Behaviour for messages sent in non-counting channels.
	if (message.channel.id !== guildSettings.countingChannelID) {
		// Only reply to messages starting with the specified prefix.
		if (!message.content.startsWith(guildSettings.prefix)) return;

		// Split message into arguments (delimited by spaces in the message).
		const args = message.content.slice(guildSettings.prefix.length).trim().split(/ +/);

		// Pop the first item from args to use as the command name.
		const commandName = args.shift().toLowerCase();

		// Check that the given command actually exists.
		if (!client.commands.has(commandName)) return;

		// Retrieve the contents of the command (this will return nothing if the command doesn't exist).
		const command = client.commands.get(commandName);

		// Check whether the command can be executed in DMs.
		if (command.guildOnly && message.channel.type !== "text") {
			return message.reply("I can't execute that command inside DMs, sorry!");
		}

		// Check whether the command can only be executed by the guild owner.
		if (command.ownerOnly && message.author.id !== message.guild.ownerID) {
			return message.reply("You don't have permission to run that command. :eyes:");
		}

		// If the command has been listed as taking arguments, ensure the user has provided them.
		if (command.args && !args.length) {
			let reply = `You didn't provide any arguments, ${message.author}!`;

			if (command.usage) {
				reply += `\n**Usage:** \`${guildSettings.prefix}${command.name} ${command.usage}\``;
			}

			return message.channel.send(reply);
		}

		// Attempt to execute the body of the command.
		try {
			command.execute(message, args);
		} catch (err) {
			console.error(err);
			return message.reply("There was an error trying to execute that command. Hmm...");
		}

		// Return here so the "counting logic" isn't applied to the command after it's been processed.
		return;
	}

	// Split the message up into parts.
	const messageSplit = message.content.split(" ");
	let messageNumber = messageSplit[0];

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
	if (message.author.id === guildSettings.prevUserID) {
		message.delete().catch((err) => console.error(err));
		return;
	} else {
		// Store the id of the user to prevent consecutive entries by the same user.
		client.settings.set(message.guild.id, message.author.id, "prevUserID");
	}

	// Check that the start of the message equals the expected count value.
	if (messageNumber !== guildSettings.nextCount) {
		message.channel.send(`:boom: **Wrong number, ${message.author.toString()}!**`);
		client.settings.set(message.guild.id, 1, "nextCount");

		// Fetch the message-to-be-pinned by its ID, and then pin it.
		message.channel.messages
			.fetch(guildSettings.highestMessageID)
			.then((message) => {
				if (!message.pinned) message.pin().catch((err) => console.error(err));
			})
			.catch((err) => console.error(err));
	} else {
		// Save the timestamp of the latest valid message.
		client.settings.set(message.guild.id, message.createdTimestamp, "latestMessageTimestamp");

		// Increment the expected count.
		client.settings.inc(message.guild.id, "nextCount");

		// Update the highest score for the server, to keep track of when to pin.
		if (messageNumber > guildSettings.highestCount) {
			client.settings.inc(message.guild.id, "highestCount");

			// Store the id of the new highest message.
			client.settings.set(message.guild.id, message.id, "highestMessageID");
		}
	}
});

client.on("messageDelete", (message) => {
	// Attempt to retrieve the settings for the current server, otherwise loading a copy of the
	// default settings.
	guildSettings = client.settings.ensure(message.guild.id, defaultSettings);

	// Only do anything if the deleted message was in the counting channel.
	if (message.channel.id !== guildSettings.countingChannelID) return;

	if (message.createdTimestamp === guildSettings.latestMessageTimestamp) {
		// Grab the number component from the deleted message, and repost it.
		const messageNum = message.content.split(" ")[0];
		return message.channel.send(`**${messageNum}**, from ${message.author.toString()}. `);
	}
});

client.login(CLIENT_TOKEN);
