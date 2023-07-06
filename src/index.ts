"use strict";

import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

import { database } from "./database/guild";

import { commandHandler, slashCommandHandler } from "./handlers/commands";
import { countingHandler } from "./handlers/counting";

console.log("Initialised command collection.");

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.user.setPresence({
    status: "online",
    activities: [
      {
        type: ActivityType.Watching,
        name: "people count",
      },
    ],
  });
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isCommand()) return;

  // Retrieve the settings for the current guild.
  const gdb = database.getGuild(interaction.guildId);

  if (interaction.channelId === gdb.channel) return;

  slashCommandHandler(interaction, gdb);
});

client.on(Events.MessageCreate, message => {
  // Will not respond to the message if it's from a bot or isn't a guild message.
  if (!message.guild || message.author.bot) return;

  const gdb = database.getGuild(message.guild.id);

  if (message.channelId === gdb.channel) {
    countingHandler(message, gdb);
  } else if (message.content.startsWith(gdb.prefix)) {
    commandHandler(message, gdb);
  }
});

client.on(Events.MessageDelete, async message => {
  // Retrieve the settings for the current guild.
  const gdb = database.getGuild(message.guildId);

  // Only do anything if the deleted message was in the counting channel.
  if (message.channelId !== gdb.channel) return;

  if (message.createdTimestamp === gdb.latestMessage) {
    // Grab the number component from the deleted message, and repost it.
    message.channel.send(
      `**${
        (gdb.get("nextCount") as number) - 1
      }**, from ${message.author.toString()}. `,
    );
  }
});

client.on(Events.GuildCreate, async guild => {
  const message = `
Hello, I'm Countable! :wave:
Thanks for inviting me to your server!

You can set the channel you want me to manage with **\`set-channel #channel-name**
If you've already done some counting, update me with on your progress using **\`set-count <count>**
This will set the value of the **next expected** count in your server.

:books: For more information on what I can do, such as saves and milestones, check out my documentation: https://docs.countable.cc

Happy Counting!
  `;

  const guildOwner = await client.users.fetch(guild.ownerId);

  guildOwner.send(message);
});

client.login(process.env.CLIENT_TOKEN);
