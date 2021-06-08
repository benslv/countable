import { Message } from "discord.js";
import { guild_db } from "../database/guild";

import * as leaderboard from "../commands/leaderboard";
import * as milestone from "../commands/milestone";
import * as ping from "../commands/ping";
import * as serverinfo from "../commands/serverinfo";
import * as setchannel from "../commands/set-channel";
import * as setcount from "../commands/set-count";
import * as setemoji from "../commands/set-emoji";
import * as sethighestcount from "../commands/set-highestcount";
import * as setnomessage from "../commands/set-nomessage";
import * as setnumbersonly from "../commands/set-numbersonly";
import * as setprefix from "../commands/set-prefix";

export type execute_args = {
  message: Message;
  gdb: guild_db;
  args?: string[];
};

type execute_t = (_: execute_args) => Promise<Message>;

export type metadata_t = {
  name: string;
  aliases: string[];
  description: string;
  checkArgs: (() => boolean) | ((args: string[]) => boolean);
  guildOnly: boolean;
  ownerOnly: boolean;
  usage: string;
};

export type command_t = {
  metadata: metadata_t;
  execute: execute_t;
};

const commands: command_t[] = [
  {
    metadata: leaderboard.metadata,
    execute: leaderboard.execute,
  },
  {
    metadata: milestone.metadata,
    execute: milestone.execute,
  },
  {
    metadata: ping.metadata,
    execute: ping.execute,
  },
  {
    metadata: serverinfo.metadata,
    execute: serverinfo.execute,
  },
  {
    metadata: setchannel.metadata,
    execute: setchannel.execute,
  },
  {
    metadata: setcount.metadata,
    execute: setcount.execute,
  },
  {
    metadata: setemoji.metadata,
    execute: setemoji.execute,
  },
  {
    metadata: sethighestcount.metadata,
    execute: sethighestcount.execute,
  },
  {
    metadata: setnomessage.metadata,
    execute: setnomessage.execute,
  },
  {
    metadata: setnumbersonly.metadata,
    execute: setnumbersonly.execute,
  },
  {
    metadata: setprefix.metadata,
    execute: setprefix.execute,
  },
];

export function commandHandler(message: Message, gdb: guild_db) {
  // Split message into arguments (delimited by spaces in the message).
  const args = message.content.slice(gdb.prefix.length).trim().split(/ +/);

  // Pop the first item from args to use as the command name.
  const commandName = args.shift().toLowerCase();

  // Retrieve the contents of the command (this will return nothing if the command doesn't exist).
  const command = commands.find(cmd => {
    return (
      cmd.metadata.name == commandName ||
      cmd.metadata.aliases.includes(commandName)
    );
  });

  // Check that the given command actually exists.
  if (!command) return;

  // Check whether the command can be executed in DMs.
  if (command.metadata.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command inside DMs, sorry!");
  }

  // Check whether the command can only be executed by the guild owner.
  if (
    command.metadata.ownerOnly &&
    message.author.id !== message.guild.ownerID
  ) {
    return message.reply(
      "You don't have permission to run that command. :eyes:",
    );
  }

  // If the command has been listed as taking arguments, ensure the user has provided them.
  if (!command.metadata.checkArgs(args)) {
    let reply = `You didn't provide the correct arguments, ${message.author}!`;

    if (command.metadata.usage) {
      reply += `\n**Usage:** \`${gdb.prefix}${command.metadata.name} ${command.metadata.usage}\``;
    }

    return message.channel.send(reply);
  }

  // Attempt to execute the body of the command.
  try {
    return command.execute({ message, args, gdb });
  } catch (err) {
    console.error(err);
    return message.reply(
      "There was an error trying to execute that command. Hmm...",
    );
  }
}
