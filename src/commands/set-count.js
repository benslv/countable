const utils = require("../utils");

module.exports = {
  name: "set-count",
  description: "Sets the value of the next expected count.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<number>",
  execute({ message, args, gdb }) {
    const count = args[0];

    if (!utils.isNumber(count)) {
      return message.channel.send("I'm sorry, that's not a valid number.");
    }

    gdb.set("nextCount", parseInt(count, 10));

    message.channel.send(
      `The next expected count has been updated to \`${count}\``,
    );

    console.log(`Updated next expected count to ${count}.`);
  },
};
