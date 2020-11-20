module.exports = {
  name: "reload",
  args: true,
  usage: "<command name>",
  guildOnly: false,
  ownerOnly: true,
  description: "Reloads a command.",
  execute(message, args) {
    const commandName = args[0].toLowerCase();
    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        cmd => cmd.aliases && cmd.aliases.includes(commandName),
      );

    if (!command)
      return message.channel.send(
        `There is no command with name or alias \`${commandName}\`, ${message.author}!`,
      );

    delete require.cache[require.resolve(`./${command.name}.js`)];

    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(`The command \`${command.name}\` was reloaded!`);
    } catch (err) {
      console.error(err);
      message.channel.send(
        `There was an error while reloading the command \`${command.name}\`:\n\`${err.message}\``,
      );
    }
  },
};
