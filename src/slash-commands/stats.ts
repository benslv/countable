import {
  ChatInputCommandInteraction,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";

import { guildDB } from "../@types/guild";
import { embedError, embedInfo } from "../utils";

export const data = new SlashCommandBuilder()
  .setName("stats")
  .setDescription("Look at information for a particular user.")
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("The user to look up")
      .setRequired(true),
  );

export async function execute(
  interaction: ChatInputCommandInteraction,
  gdb: guildDB,
) {
  const user = interaction.options.getUser("user");
  const userId = user.id;
  const userInfo = gdb.users[userId];

  console.log(userId);
  console.log(userInfo);

  if (!userInfo) {
    return interaction.reply({
      embeds: [
        embedError
          .setTitle("User not found")
          .setDescription(
            "Sorry, I couldn't find that user.\n\nMake sure you mentioned the correct person.\nPerhaps they haven't done any counting yet?",
          ),
      ],
    });
  }

  const response = await getUserStats(userId, interaction, gdb);

  return interaction.reply({
    embeds: [response],
  });
}

async function getUserStats(
  id: string,
  interaction: CommandInteraction,
  gdb: guildDB,
) {
  const correct = gdb.users[id].correct;
  const incorrect = gdb.users[id].incorrect;
  const score = correct - incorrect;
  const accuracy = `${(100 * (correct / (correct + incorrect))).toFixed(2)}%`;
  const points = gdb.users[id].points;

  const user = await interaction.client.users.fetch(id);

  return embedInfo
    .setTitle(`Stats for ${user.tag}`)
    .setDescription(`Here are the stats for ${user.toString()}!`)
    .setThumbnail(user.avatarURL({ size: 128 }) || user.defaultAvatarURL)
    .addFields(
      {
        name: "Total Counts",
        value: (correct + incorrect).toString(),
        inline: true,
      },
      {
        name: "Correct",
        value: correct.toString(),
        inline: true,
      },
      {
        name: "Incorrect",
        value: incorrect.toString(),
        inline: true,
      },
      {
        name: "Score",
        value: score.toString(),
        inline: true,
      },
      {
        name: "Accuracy",
        value: accuracy,
        inline: true,
      },
      {
        name: "Money",
        value: points.toString(),
        inline: true,
      },
    );
}
