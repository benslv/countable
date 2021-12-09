import { SlashCommandBuilder } from "@discordjs/builders";

import { embedInfo, getUserScore } from "../utils";

import { guildDB, userT } from "../@types/guild";

const info = {
  name: "leaderboard",
  aliases: ["board", "top", "scoreboard"],
  description: "Displays the leaderboard for the current guild.",
  checkArgs: (): boolean => true,
  guildOnly: true,
  ownerOnly: false,
  usage: "",
};

export const metadata = new SlashCommandBuilder()
  .setName(info.name)
  .setDescription(info.description);

function byScore(a, b): number {
  return getUserScore(b) - getUserScore(a);
}

export async function execute(interaction, gdb: guildDB) {
  const medals = ["🥇", "🥈", "🥉"];

  // Get all users stored in gdb
  const users: userT[] = Array.from(Object.values(gdb.users));

  // Sort by score
  const top15 = users.sort(byScore).slice(0, 15);

  const scoreStrings = [];

  let i = 0;
  for (const user of top15) {
    let userInfo;
    try {
      userInfo = await interaction.client.users.fetch(user.id);
    } catch (err) {
      console.error(`Unable to find user info for ${user.id}`);
    }
    const score = getUserScore(user);

    scoreStrings.push(
      `${medals[i] || "🔸"} **${score}** - ${
        userInfo ? userInfo.tag : "*Unknown User*"
      }`,
    );

    i += 1;
  }

  return interaction.reply({
    embeds: [
      embedInfo
        .setTitle(`Top counters in ${interaction.guild.name}`)
        .setDescription(scoreStrings.join("\n"))
        .setFooter("Sorted by player score")
        .setTimestamp(new Date()),
    ],
  });
}
