import { Message } from "discord.js";
import { guild_db } from "../database/guild";

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
  metatdata: metadata_t;
  func: execute_t;
};

export function commandHandler(message: Message, gdb: guild_db) {
  // Split message into arguments (delimited by spaces in the message).
  const args = message.content.slice(gdb.prefix.length).trim().split(/ +/);

  // Pop the first item from args to use as the command name.
  const commandName = args.shift().toLowerCase();

  // Retrieve the contents of the command (this will return nothing if the command doesn't exist).
  const command =
    message.client.commands.get(commandName) ||
    message.client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName),
    );

  // Check that the given command actually exists.
  if (!command) return;

  // Check whether the command can be executed in DMs.
  if (command.guildOnly && message.channel.type !== "text") {
    return message.reply("I can't execute that command inside DMs, sorry!");
  }

  // Check whether the command can only be executed by the guild owner.
  if (command.ownerOnly && message.author.id !== message.guild.ownerID) {
    return message.reply(
      "You don't have permission to run that command. :eyes:",
    );
  }

  // If the command has been listed as taking arguments, ensure the user has provided them.
  if (!command.checkArgs(args)) {
    let reply = `You didn't provide the correct arguments, ${message.author}!`;

    if (command.usage) {
      reply += `\n**Usage:** \`${gdb.prefix}${command.name} ${command.usage}\``;
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
