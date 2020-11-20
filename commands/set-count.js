module.exports = {
  name: "set-count",
  description: "Sets the value of nextCount the number provided by the user.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<number>",
  execute(message, args) {
    // Regex testing for a string being a number.
    const isNumber = n => /^\d+$/.test(n);

    // Delete the message if it doesn't start with a number.
    if (!isNumber(args[0])) {
      return message.channel.send("I'm sorry, that's not a valid number.");
    }

    message.client.settings.set(
      message.guild.id,
      parseInt(args[0], 10),
      "nextCount",
    );

    message.channel.send(
      `The count has been updated to ${message.client.settings.get(
        message.guild.id,
        "nextCount",
      )}`,
    );
  },
};
