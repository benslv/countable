const { embed } = require("../utils");

module.exports = {
  name: "ping",
  args: false,
  usage: "",
  guildOnly: false,
  ownerOnly: false,
  description: "Replies to the user to confirm the bot is running correctly!",
};

module.exports.execute = ({ message }) => {
  message.channel.send({
    embed: embed(message, {
      type: "success",
      title: "🏓 Pong!",
      description: "Everything seems to be in order.",
    }),
  });
};
