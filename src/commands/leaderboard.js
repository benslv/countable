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
    console.log(top15);

    const scoreStrings = [];

    top15.forEach((user, i) => {
      const score = getUserScore(user);

      scoreStrings.push(
        `${medals[i] ? medals[i] : "🔸"} **${score}** - <@${user.id}>`,
      );
    });

    message.channel.send({
      embed: embed(message, {
        type: "info",
        title: `Top counters in ${message.guild.name}`,
        description: scoreStrings.join("\n"),
        footer: "Sorted by score",
      }),
    });
  },
};

const byScore = (a, b) => getUserScore(b) - getUserScore(a);
