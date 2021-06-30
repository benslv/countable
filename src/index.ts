"use strict";

// Config containing bot token and prefix.
import config from "../config.json";
const { CLIENT_TOKEN } = config;

import * as Discord from "discord.js";
const client = new Discord.Client();

import { database } from "./database/guild";

import { commandHandler } from "./handlers/commands";
import { countingHandler } from "./handlers/counting";

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

client.on("message", async message => {
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

client.on("messageDelete", async message => {
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

client.on("guildCreate", async guild => {
  const message = `
Hello, I'm Countable! :wave:
Thanks for inviting me to your server!

You can set the channel you want me to manage with **\`set-channel #channel-name**
If you've already done some counting, update me with on your progress using **\`set-count <count>**
This will set the value of the **next expected** count in your server.

:books: For more information on what I can do, such as saves and milestones, check out my documentation: https://docs.countable.cc

Happy Counting!
  `;

  const guildOwner = await client.users.fetch(guild.ownerID);

  guildOwner.send(message);
});

client.login(CLIENT_TOKEN);
