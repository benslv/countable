"use strict";

// Config containing bot token and prefix.
const config = require("./config.json");
const { CLIENT_TOKEN } = config;

const Discord = require("discord.js");
const client = new Discord.Client();

const fs = require("fs");

const Enmap = require("enmap");

const commandHandler = require("./handlers/commands");
const countingHandler = require("./handlers/counting");

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
  emojiReactionID: "757984604912353421",
  noMessageReaction: true,
  numbersOnly: false,
  milestones: {},
};

// Create a new collection to store the bot's commands.
client.commands = new Discord.Collection();

// Filter out any files that aren't `.js` files.
const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

// Iterate through the list of available commands and add them all to the commands Collection.
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

console.log("Initialised command collection.");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", message => {
  // Will not respond to the message if it's from a bot or isn't a guild message.
  if (!message.guild || message.author.bot) return;

  // Attempt to retrieve the settings for the current server, otherwise loading a copy of the
  // default settings.
  const guildSettings = client.settings.ensure(
    message.guild.id,
    defaultSettings,
  );

  // Behaviour for messages sent in non-counting channels.
  if (message.channel.id === guildSettings.countingChannelID) {
    return countingHandler(message, guildSettings);
  } else if (message.content.startsWith(guildSettings.prefix)) {
    return commandHandler(message, guildSettings);
  }
});

client.on("messageDelete", message => {
  // Attempt to retrieve the settings for the current server, otherwise loading a copy of the
  // default settings.
  const guildSettings = client.settings.ensure(
    message.guild.id,
    defaultSettings,
  );

  // Only do anything if the deleted message was in the counting channel.
  if (message.channel.id !== guildSettings.countingChannelID) return;

  if (message.createdTimestamp === guildSettings.latestMessageTimestamp) {
    // Grab the number component from the deleted message, and repost it.
    return message.channel.send(
      `**${
        client.settings.get(message.guild.id, "nextCount") - 1
      }**, from ${message.author.toString()}. `,
    );
  }
});

client.login(CLIENT_TOKEN);
