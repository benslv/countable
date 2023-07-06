import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { guildDB } from "../@types/guild";
import { embedInfo } from "../utils";

export const data = new SlashCommandBuilder()
  .setName("serverinfo")
  .setDescription(
    "Display a bunch of useful, interesting information about the current server.",
  )
  .setDMPermission(false);

export async function execute(
  interaction: ChatInputCommandInteraction,
  gdb: guildDB,
) {
  const {
    prefix,
    nextCount,
    highestCount,
    prevUserID,
    emojiID,
    milestones,
    users,
    saves,
    savePrice,
    correctCounts,
  } = gdb;

  const prevUser = await interaction.client.users.fetch(prevUserID);

  const emoji = interaction.client.emojis.cache.get(emojiID);

  return interaction.reply({
    embeds: [
      embedInfo
        .setTitle(`Info about ${interaction.guild.name}`)
        .setDescription("Here's everything I could find!")
        .setThumbnail(interaction.guild.iconURL({ size: 128 }))
        .addFields(
          { name: "Next count", value: nextCount.toString(), inline: true },
          {
            name: "Highest count",
            value: highestCount.toString(),
            inline: true,
          },
          {
            name: "Total counts",
            value: correctCounts.toString(),
            inline: true,
          },
          {
            name: "# Milestones",
            value: Object.keys(milestones).length.toString(),
            inline: true,
          },
          {
            name: "# Counters",
            value: Object.keys(users).length.toString(),
            inline: true,
          },
          { name: "# Saves", value: saves.length.toString(), inline: true },
          { name: "Save price", value: savePrice.toString(), inline: true },
          {
            name: "Reaction emoji",
            value: emoji?.toString() ?? emojiID,
            inline: true,
          },
          {
            name: "Prefix",
            value: prefix.toString(),
            inline: true,
          },
          {
            name: "Most recent counter",
            value: prevUser.toString(),
            inline: true,
          },
        ),
    ],
  });
}
