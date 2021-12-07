import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

import { guildDB } from "../@types/guild";

const info = {
  name: "server",
  aliases: ["info", "server"],
  checkArgs: () => true,
  usage: "",
  guildOnly: true,
  ownerOnly: false,
  description:
    "Display a bunch of useful/interesting information about the current server.",
};

export const metadata = new SlashCommandBuilder()
  .setName(info.name)
  .setDescription(info.description);

export async function execute(interaction, gdb: guildDB) {
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

  const prevUser = interaction.client.users.cache.get(prevUserID) || "no-one!";

  const emoji = interaction.client.emojis.cache.get(emojiID) || "N/A";

  return interaction.reply({
    embeds: [
      new MessageEmbed()
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
            value: emoji.toString(),
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
