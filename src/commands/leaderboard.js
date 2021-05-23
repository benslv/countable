const { getUserScore, embed } = require("../utils");

module.exports = {
  name: "leaderboard",
  description: "Displays the leaderboard for the current guild.",
  args: false,
  guildOnly: true,
  ownerOnly: false,
  usage: "",
  execute: async ({ message, gdb }) => {
    const medals = ["🥇", "🥈", "🥉"];

    // Get all users stored in gdb
    const users = Array.from(Object.values(gdb.users));

    // Sort by score
    const top15 = users.sort(byScore).slice(0, 15);

    const scoreStrings = [];

    let i = 0;
    for (let user of top15) {
      let userInfo;
      try {
        userInfo = await message.client.users.fetch(user.id);
      } catch (err) {
        console.error(err);
      }
      const score = getUserScore(user);

      scoreStrings.push(
        `${medals[i] || "🔸"} **${score}** - ${
          userInfo ? userInfo.tag : "*Unknown User*"
        }`,
      );

      i += 1;
    }

    message.channel.send({
      embed: embed(message, {
        type: "info",
        title: `Top counters in ${message.guild.name}`,
        description: scoreStrings.join("\n"),
        footer: { text: "Sorted by player score" },
        timestamp: new Date(),
      }),
    });
  },
};

const byScore = (a, b) => getUserScore(b) - getUserScore(a);
