module.exports = {
  name: "set-emoji",
  description:
    "Sets the reaction used by the bot when a user sends a count with not message.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<emote ID>",
  execute(message, args) {
    // Retrieve all of the emojis the bot has access to.
    const guildEmojis = message.client.emojis.cache;

    if (guildEmojis.has(args[0])) {
      const emoji = guildEmojis.get(args[0]);
      message.client.settings.set(message.guild.id, args[0], "emojiReactionID");
      message.channel.send(
        `The emoji reaction has been updated and set to ${emoji}`,
      );
    } else {
      message.channel.send(
        "I couldn't find that emoji in my list. Make sure the ID is correct...",
      );
    }
  },
};
