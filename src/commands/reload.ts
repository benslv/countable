import { Message } from "discord.js";
import { command_t, execute_args, metadata_t } from "../handlers/commands";
import { embed } from "../utils";

export const metadata: metadata_t = {
  name: "reload",
  aliases: ["r", "rel"],
  checkArgs: args => args.length == 1,
  usage: "<command name>",
  guildOnly: false,
  ownerOnly: true,
  description: "Reloads a command.",
};

export function execute({ message, args }: execute_args): Promise<Message> {
  const commandName = args[0].toLowerCase();
  const command =
    message.client.commands.get(commandName) ||
    message.client.commands.find(
      (cmd: command_t) =>
        cmd.metatdata.aliases && cmd.metatdata.aliases.includes(commandName),
    );

  if (!command) {
    return message.channel.send({
      embed: embed(message, {
        type: "error",
        title: "Command not found.",
        description: `There is no command with name or alias \`${commandName}\`.`,
      }),
    });
  }

  delete require.cache[require.resolve(`./${command.name}.js`)];

  try {
    const newCommand = require(`./${command.name}.js`);
    message.client.commands.set(newCommand.name, newCommand);
    console.log(`Successfully reloaded command: ${commandName}.`);
    return message.channel.send({
      embed: embed(message, {
        type: "success",
        title: "Command reloaded!",
        description: `Successfully reloaded command: \`${commandName}\`.`,
      }),
    });
  } catch (err) {
    console.error(err);
    return message.channel.send({
      embed: embed(message, {
        type: "error",
        title: "Error reloading.",
        description: `There was an error while reloading the command \`${command.name}\`:\n\`${err.message}\``,
      }),
    });
  }
}
