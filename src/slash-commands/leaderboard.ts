import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  User,
} from "discord.js";

import { guildDB, userT } from "../@types/guild";
import { embedInfo, getUserScore } from "../utils";

export const data = new SlashCommandBuilder()
  .setName("leaderboard")
  .setDescription("Displays the leaderboard for the current guild.")
  .setDMPermission(false);

export async function execute(
  interaction: ChatInputCommandInteraction,
  gdb: guildDB,
) {
  const medals = ["🥇", "🥈", "🥉"];

  // Get all users stored in gdb
  const users: userT[] = Array.from(Object.values(gdb.users));

  // Sort by score
  const top15 = users.sort(byScore).slice(0, 15);

  const scoreStrings = [];

  let i = 0;
  for (const user of top15) {
    let userInfo: User;
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
        .setFooter({ text: "Sorted by player score" })
        .setTimestamp(new Date()),
    ],
  });
}

function byScore(a: userT, b: userT): number {
  return getUserScore(b) - getUserScore(a);
}
