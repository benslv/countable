"use strict";

const fs = require("fs");

// Config containing bot token and prefix.
const config = require("./config.json");
const { CLIENT_TOKEN } = config;

const Discord = require("discord.js");
const client = new Discord.Client();

const guild = require("./database/guild");

const commandHandler = require("./handlers/commands");
const countingHandler = require("./handlers/counting");

// Create a new collection to store the bot's commands.
client.commands = new Discord.Collection();

// Filter out any files that aren't `.js` files.
const commandFiles = fs
  .readdirSync("src/commands/")
  .filter(file => file.endsWith(".js"));

// Iterate through the list of available commands and add them all to the commands Collection.
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  client.commands.set(command.name, command);
}

console.log("Initialised command collection.");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setPresence({
    status: "online",
    activity: {
      type: "WATCHING",
      name: "people count",
    },
  });
});

client.on("message", message => {
  // Will not respond to the message if it's from a bot or isn't a guild message.
  if (!message.guild || message.author.bot) return;

  // Retrieve the settings for the current guild.
  const gdb = guild(message.guild.id);

  // Behaviour for messages sent in non-counting channels.
  if (message.channel.id === gdb.channel) {
    return countingHandler({ message, gdb });
  } else if (message.content.startsWith(gdb.prefix)) {
    return commandHandler({ message, gdb });
  }
});

client.on("messageDelete", message => {
  // Retrieve the settings for the current guild.
  const gdb = guild(message.guild.id);

  // Only do anything if the deleted message was in the counting channel.
  if (message.channel.id !== gdb.channel) return;

  if (message.createdTimestamp === gdb.latestMessage) {
    // Grab the number component from the deleted message, and repost it.
    return message.channel.send(
      `**${
        gdb.get(message.guild.id, "nextCount") - 1
      }**, from ${message.author.toString()}. `,
    );
  }
});

client.login(CLIENT_TOKEN);
