const { embed } = require("../utils");

module.exports = {
  name: "set-numbersonly",
  aliases: ["numbersonly"],
  description:
    "Sets whether messages are allowed to contain a message after their number count.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<true|false>",
};

module.exports.execute = ({ message, args, gdb }) => {
  const arg = args[0].toLowerCase();

  if (arg === "true" || arg === "false") {
    gdb.set("numbersOnly", JSON.parse(arg));

    console.log(`Set numbers only to ${arg}.`);

    if (arg === "true") {
      return message.channel.send({
        embed: embed(message, {
          type: "success",
          title: "Numbers-only mode enabled.",
          description: "Counts now **aren't** allowed a message after them.",
        }),
      });
    } else {
      return message.channel.send({
        embed: embed(message, {
          type: "success",
          title: "Numbers-only mode disabled.",
          description: "Counts now **are** allowed a message after them.",
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
};
