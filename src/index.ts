"use strict";

// Config containing bot token and prefix.
import config from "../config.json";
const { CLIENT_TOKEN } = config;

import * as Discord from "discord.js";
const client = new Discord.Client();

import { database } from "./database/guild";

import { commandHandler } from "./handlers/commands";
import { countingHandler } from "./handlers/counting";
import * as leaderboard from "./commands/leaderboard";
import * as milestone from "./commands/milestone";
import * as ping from "./commands/ping";
import * as reload from "./commands/reload";
import * as serverinfo from "./commands/serverinfo";
import * as setchannel from "./commands/set-channel";
import * as setcount from "./commands/set-count";
import * as setemoji from "./commands/set-emoji";
import * as sethighestcount from "./commands/set-highestcount";
import * as setnomessage from "./commands/set-nomessage";
import * as setnumbersonly from "./commands/set-numbersonly";
import * as setprefix from "./commands/set-prefix";

// Create a new collection to store the bot's commands.
let commands = new Discord.Collection();

// Commands
commands.set("leaderboard", {
  metadata: leaderboard.metadata,
  func: leaderboard.execute,
});
commands.set("milestone", {
  metadata: milestone.metadata,
  func: milestone.execute,
});
commands.set("ping", { metadata: ping.metadata, func: ping.execute });
commands.set("reload", { metadata: reload.metadata, func: reload.execute });
commands.set("serverinfo", {
  metadata: serverinfo.metadata,
  func: serverinfo.execute,
});
commands.set("set-channel", {
  metadata: setchannel.metadata,
  func: setchannel.execute,
});
commands.set("set-count", {
  metadata: setcount.metadata,
  func: setcount.execute,
});
commands.set("set-emoji", {
  metadata: setemoji.metadata,
  func: setemoji.execute,
});
commands.set("set-highestcount", {
  metadata: sethighestcount.metadata,
  func: sethighestcount.execute,
});
commands.set("set-nomessage", {
  metadata: setnomessage.metadata,
  func: setnomessage.execute,
});
commands.set("set-numbersonly", {
  metadata: setnumbersonly.metadata,
  func: setnumbersonly.execute,
});
commands.set("set-prefix", {
  metadata: setprefix.metadata,
  func: setprefix.execute,
});

// Iterate through the list of available commands and add them all to the commands Collection.
// for (const file of commandFiles) {
//   const command = require(`./commands/${file}`);

//   client.commands.set(command.name, command);
// }

// TODO client.commands :grimacing:

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
  const gdb = database.getGuild(message.guild.id);

  // Behaviour for messages sent in non-counting channels.
  if (message.channel.id === gdb.channel) {
    return countingHandler(message, gdb);
  } else if (message.content.startsWith(gdb.prefix)) {
    return commandHandler(message, gdb);
  }
});

client.on("messageDelete", message => {
  // Retrieve the settings for the current guild.
  const gdb = database.getGuild(message.guild.id);

  // Only do anything if the deleted message was in the counting channel.
  if (message.channel.id !== gdb.channel) return;

  if (message.createdTimestamp === gdb.latestMessage) {
    // Grab the number component from the deleted message, and repost it.
    return message.channel.send(
      `**${
        (gdb.get("nextCount") as number) - 1
      }**, from ${message.author.toString()}. `,
    );
  }
});

client.login(CLIENT_TOKEN);
