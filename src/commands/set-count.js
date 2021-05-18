const utils = require("../utils");
const db = require("../db");

module.exports = {
  name: "set-count",
  description: "Sets the value of the next expected count.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<number>",
  execute({ message, args }) {
    const count = args[0];

    if (!utils.isNumber(count)) {
      return message.channel.send("I'm sorry, that's not a valid number.");
    }

    db.set(message.guild.id, parseInt(count, 10), "nextCount");

    message.channel.send(
      `The next expected count has been updated to \`${count}\``,
    );

    console.log(`Updated next expected count to ${count}.`);
  },
};
