const { embed } = require("../utils");

module.exports = {
  name: "reload",
  aliases: ["r", "rel"],
  args: true,
  usage: "<command name>",
  guildOnly: false,
  ownerOnly: true,
  description: "Reloads a command.",
};

module.exports.execute = ({ message, args }) => {
  const commandName = args[0].toLowerCase();
  const command =
    message.client.commands.get(commandName) ||
    message.client.commands.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName),
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
};
