module.exports = {
  name: "ping",
  args: false,
  usage: "",
  guildOnly: false,
  ownerOnly: false,
  description: "Replies to the user to confirm the bot is running correctly!",
  execute({ message }) {
    const start = Date.now();
    message.channel.send(":ping_pong: **Pong!**").then(msg => {
      const diff = Date.now() - start;
      return msg.edit(`${msg.content} \`${diff}ms\``);
    });
  },
};
