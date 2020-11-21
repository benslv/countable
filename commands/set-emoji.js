module.exports = {
  name: "set-emoji",
  description:
    "Sets the reaction used by the bot when a user sends a count with no message.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<emoji or custom emote you want to use>",
  execute(message, args) {
    // Retrieve all of the emojis the bot has access to.
    const guildEmojis = message.client.emojis.cache;

    const emojiRegex = require("emoji-regex/RGI_Emoji");
    const regex = emojiRegex();

    // An emoji can be passed in three different ways:
    // 😅                             - raw unicode (only for non-custom)
    // <:thistbh:750788857565282374>  - custom emote "object"
    // 750788857565282374             - custom emote ID

    // First, try and match a Unicode emoji. Returns null if none found.
    const emoji = regex.exec(args[0]);

    if (emoji) {
      console.log(emoji[0]);
      message.client.settings.set(
        message.guild.id,
        emoji[0],
        "emojiReactionID",
      );
      message.channel.send(
        `The emoji reaction has been updated and set to ${emoji[0]}`,
      );
    } else {
      // Otherwise, try and match a custom emote ID.
      const emojiID = args[0].match(/(\d{18})/g);

      if (emojiID && guildEmojis.has(emojiID[0])) {
        const emoji = guildEmojis.get(emojiID[0]);
        message.client.settings.set(
          message.guild.id,
          emojiID[0],
          "emojiReactionID",
        );
        message.channel.send(
          `The emoji reaction has been updated and set to ${emoji}`,
        );
      } else {
        message.channel.send(
          "I couldn't find that emoji in my list. Make sure the ID is correct...",
        );
      }
    }
  },
};
