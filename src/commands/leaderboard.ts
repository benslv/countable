import { Message, User } from "discord.js";
import { userT } from "../@types/guild";
import { execute_args } from "../handlers/commands";
import { getUserScore, embed } from "../utils";

export const metadata = {
  name: "leaderboard",
  aliases: ["board", "top", "scoreboard"],
  description: "Displays the leaderboard for the current guild.",
  checkArgs: (): boolean => true,
  guildOnly: true,
  ownerOnly: false,
  usage: "",
};

function byScore(a: userT, b: userT): number {
  return getUserScore(b) - getUserScore(a);
}

export async function execute({
  message,
  gdb,
}: execute_args): Promise<Message> {
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

  return message.channel.send({
    embed: embed(message, {
      type: "info",
      title: `Top counters in ${message.guild.name}`,
      description: scoreStrings.join("\n"),
      footer: { text: "Sorted by player score" },
      timestamp: new Date(),
    }),
  });
}
