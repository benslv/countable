// Config containing bot token and prefix.
const config = require("./config.json");

const Discord = require("discord.js");
const client = new Discord.Client();

const fs = require("fs");

const Enmap = require("enmap");

client.settings = new Enmap({
	name: "settings",
	fetchAll: false,
	autoFetch: false,
	cloneLevel: "deep",
});

const defaultSettings = {
	countingChannelID: "",
	nextCount: 1,
	highestCount: 0,
	highestMessageID: "",
	prevUserID: "",
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

	const guildConf = client.settings.ensure(message.guild.id, defaultSettings);

	// Behaviour for messages sent in non-counting channels.
	if (message.channel.id !== config.countingChannel) {
		// Only reply to messages starting with the specified prefix.
		if (!message.content.startsWith(config.prefix)) return;

		// Split message into arguments (delimited by spaces in the message).
		const args = message.content.slice(config.prefix.length).trim().split(/ +/);

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
				reply += `\n**Usage:** \`${config.prefix}${command.name} ${command.usage}\``;
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
		message.channel.send(":boom: **Wrong number!**");
		config.nextCount = 1;

		// Fetch the message-to-be-pinned by its ID, and then pin it.
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

	// Save the current contents of config back to the JSON file after every count.
	// This is probably quite bad form to do, so I might need to work out an improvement?
	fs.writeFile("config.json", JSON.stringify(config), () =>
		console.log("Successfully saved data!"),
	);
});

client.login(config.clientToken);
