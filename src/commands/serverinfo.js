const { embed } = require("../utils");

module.exports = {
  name: "serverinfo",
  args: false,
  usage: "",
  guildOnly: true,
  ownerOnly: false,
  description:
    "Display a bunch of useful/interesting information about the current server.",
  execute: async ({ message, gdb }) => {
    const { nextCount, highestCount, prevUserID, emojiID, milestones, users } =
      gdb;

    const prevUser = await message.client.users.fetch(prevUserID);

    const emoji = message.client.emojis.cache.get(emojiID);

    message.channel.send({
      embed: embed(
        message,
        {
          type: "info",
          title: `Info about ${message.guild.name}`,
          description: "Here's everything I could find!",
          thumbnail: {
            url: message.guild.iconURL({ size: 128 }),
          },
          fields: [
            { name: "Next count", value: nextCount, inline: true },
            { name: "Highest count", value: highestCount, inline: true },
            {
              name: "Most recent counter",
              value: prevUser,
              inline: true,
            },
            {
              name: "# Milestones",
              value: Object.keys(milestones).length,
              inline: true,
            },
            {
              name: "# Counters",
              value: Object.keys(users).length,
              inline: true,
            },
            {
              name: "Reaction emoji",
              value: emoji,
              inline: true,
            },
          ],
        },
        true,
      ),
    });
  },
};
