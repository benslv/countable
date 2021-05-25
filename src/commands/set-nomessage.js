const { embed } = require("../utils");

module.exports = {
  name: "set-nomessage",
  aliases: ["nomessage"],
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

      console.log(`Set "no message reaction" to ${arg}.`);

      if (arg === "true") {
        return message.channel.send({
          embed: embed(message, {
            type: "success",
            title: "Message reactions enabled.",
            description: "Messages now **will** be reacted to when left empty.",
          }),
        });
      } else {
        return message.channel.send({
          embed: embed(message, {
            type: "success",
            title: "Message reactions disabled.",
            description:
              "Messages now **won't** be reacted to when left empty.",
          }),
        });
      }
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
