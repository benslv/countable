module.exports = {
  name: "set-nomessage",
  description:
    "Sets whether or not the bot should react to any counts not containing a message.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<true|false>",
  execute(message, args) {
    const arg = args[0].toLowerCase();

    if (arg === "true" || arg === "false") {
      message.client.settings.set(
        message.guild.id,
        JSON.parse(arg), // converts the string representation into a boolean value.
        "noMessageReaction",
      );
      message.channel.send(
        `Messages now **${
          arg === "true" ? "will" : "won't"
        }** be reacted to when left empty.`,
      );
      console.log(`Set "no message reaction" to ${arg}.`);
    } else {
      message.channel.send(
        "That's not a valid argument. Please enter `true` or `false`.",
      );
    }
  },
};
