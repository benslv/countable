import { ChannelType, ChatInputCommandInteraction, Message } from "discord.js";
import { guildDB } from "../@types/guild";
import { commands } from "../commands";
import { commands as slashCommands } from "../slash-commands";

export async function commandHandler(
  message: Message,
  gdb: guildDB,
): Promise<void | Message> {
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
  if (
    command.metadata.guildOnly &&
    message.channel.type !== ChannelType.GuildText
  ) {
    return message.reply("I can't execute that command inside DMs, sorry!");
  }

  // Check whether the command can only be executed by the guild owner.
  if (
    command.metadata.ownerOnly &&
    message.author.id !== message.guild.ownerId
  ) {
    return message.reply(
      "You don't have permission to run that command. :eyes:",
    );
  }

  // If the command has been listed as taking arguments, ensure the user has provided them.
  if (!command.metadata.checkArgs(args)) {
    let reply = `You didn't provide the correct arguments, ${message.author.toString()}!`;

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

export async function slashCommandHandler(
  interaction: ChatInputCommandInteraction,
  gdb: guildDB,
) {
  const commandName = interaction.commandName;

  const command = slashCommands.get(commandName);

  if (!command) return;

  const guild = await interaction.guild.fetch();

  const modRole = await guild.roles.fetch(gdb.modRoleId);
  const modUsers = modRole.members;

  const isOwner = interaction.member.user.id === interaction.guild.ownerId;

  const canRunModCommands =
    (gdb.modRoleId && modUsers.has(interaction.member.user.id)) || isOwner;

  const isModOnly = command.metadata.modOnly;

  if (isModOnly && !canRunModCommands) {
    await interaction.reply({
      content:
        ":warning: **Permission denied**. You need to be a moderator to do that.",
    });

    return;
  }

  try {
    await command.execute(interaction, gdb);
  } catch (err) {
    console.error(err);

    await interaction.reply({
      content:
        err.message ||
        "Sorry, there was an error while executing this command!",
      ephemeral: true,
    });
  }
}
