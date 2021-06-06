const utils = require("../utils");

module.exports = {
  name: "set-count",
  aliases: ["count", "="],
  description: "Sets the value of the next expected count.",
  checkArgs: args => args.length === 1,
  guildOnly: true,
  ownerOnly: true,
  usage: "<number>",
};

module.exports.execute = ({ message, args, gdb }) => {
  const count = args[0];

  if (!utils.isNumber(count)) {
    return message.channel.send({
      embed: utils.embed(message, {
        type: "error",
        title: "Invalid number.",
        description:
          "Sorry, that's not a valid number. Make sure to use a positive integer!",
      }),
    });
  }

  gdb.set("nextCount", parseInt(count, 10));
  console.log(`Updated next expected count to ${count}.`);

  return message.channel.send({
    embed: utils.embed(message, {
      type: "success",
      title: "Count updated!",
      description: `The next expected count has been updated to \`${count}\``,
    }),
  });
};
