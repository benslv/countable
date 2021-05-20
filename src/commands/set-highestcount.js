const utils = require("../utils");

module.exports = {
  name: "set-highestcount",
  description: "Sets the value of the highest-reached count.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<number>",
  execute({ message, args, gdb }) {
    const count = args[0];

    if (!utils.isNumber(count)) {
      return message.channel.send("I'm sorry, that's not a valid number.");
    }

    gdb.set("highestCount", parseInt(count, 10));

    message.channel.send(`The highest count has been updated to \`${count}\``);

    console.log(`Updated highest count to ${count}.`);
  },
};
