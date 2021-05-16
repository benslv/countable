const utils = require("../utils");

module.exports = {
  name: "set-count",
  description: "Sets the value of nextCount the number provided by the user.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<number>",
  execute(message, args) {
    const count = args[0];

    // Delete the message if it doesn't start with a number.
    if (!utils.isNumber(count)) {
      message.channel.send("I'm sorry, that's not a valid number.");
    }

    message.client.settings.set(
      message.guild.id,
      parseInt(count, 10),
      "nextCount",
    );

    message.channel.send(
      `The next expected count has been updated to \`${message.client.settings.get(
        message.guild.id,
        "nextCount",
      )}\`.`,
    );

    console.log(`Updated next expected count to ${count}.`);
  },
};
