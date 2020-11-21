module.exports = {
  name: "set-numbersonly",
  description:
    "Sets whether messages are allowed to contain a message after their number count.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<true|false>",
  execute(message, args) {
    const arg = args[0].toLowerCase();

    if (arg === "true" || arg === "false") {
      message.client.settings.set(message.guild.id, JSON.parse(arg), "numbersOnly");
      message.channel.send(
        `Counts now **${
          arg === "true" ? "aren't" : "are"
        }** allowed a message after them.`,
      );
    } else {
      message.channel.send(
        "That's not a valid argument. Please enter `true` or `false`.",
      );
    }
  },
};
