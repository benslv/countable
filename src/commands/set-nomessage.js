const { embed } = require("../utils");

module.exports = {
  name: "set-nomessage",
  description:
    "Sets whether or not the bot should react to any counts not containing a message.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<true|false>",
  execute({ message, args, gdb }) {
    const arg = args[0].toLowerCase();

    if (arg === "true" || arg === "false") {
      gdb.set(
        "noMessageReaction",
        JSON.parse(arg), // converts the string representation into a boolean value.
      );

      message.channel.send({
        embed: embed(message, {
          type: "success",
          title: "Setting updated!",
          description: `Messages now **${
            arg === "true" ? "will" : "won't"
          }** be reacted to when left empty.`,
        }),
      });

      console.log(`Set "no message reaction" to ${arg}.`);
    } else {
      message.channel.send({
        embed: embed(message, {
          type: "error",
          title: "Invalid input.",
          description:
            "That's not a valid argument. Please enter `true` or `false`.",
        }),
      });
    }
  },
};
