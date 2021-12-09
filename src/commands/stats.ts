import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";

import { guildDB } from "../@types/guild";

const info = {
  name: "stats",
  aliases: [],
  description: "Replies to the user to confirm the bot is running correctly!",
  checkArgs: args => args.length == 0 || args.length == 1,
  guildOnly: true,
  ownerOnly: false,
  usage: "<blank> or <user mention>",
};

export const metadata = new SlashCommandBuilder()
  .setName(info.name)
  .setDescription(info.description)
  .addUserOption(option =>
    option
      .setName("user")
      .setDescription("The user you want information about!"),
  );

export async function execute(interaction, gdb: guildDB) {
  const user = interaction.options.getUser("user");

  if (user) {
    const response = await getUserStats(interaction, gdb, user.id);

    return interaction.reply({ embeds: [response] });
  }

  const response = await getUserStats(interaction, gdb, interaction.user.id);

  return interaction.reply({ embeds: [response] });
}

async function getUserStats(interaction, gdb, id) {
  const user = await interaction.client.users.fetch(id);

  if (!gdb.users[id]) {
    return new MessageEmbed()
      .setTitle(`Stats for ${user.tag}`)
      .setDescription(
        "Sorry, I couldn't find that user. Have they done any counting yet?",
      );
  }

  const correct = gdb.users[id].correct;
  const incorrect = gdb.users[id].incorrect;
  const score = (correct - incorrect).toString();
  const accuracy = `${(100 * (correct / (correct + incorrect))).toFixed(2)}%`;
  const points = gdb.users[id].points;

  return new MessageEmbed()
    .setTitle(`Stats for ${user.tag}`)
    .setDescription(`Here are the stats for ${user.toString()}!`)
    .setThumbnail(
      user.avatarURL({ size: 128, dynamic: true }) || user.defaultAvatarURL,
    )
    .addFields(
      {
        name: "Total Counts",
        value: correct + incorrect,
        inline: true,
      },
      {
        name: "Correct",
        value: correct,
        inline: true,
      },
      {
        name: "Incorrect",
        value: incorrect,
        inline: true,
      },
      {
        name: "Score",
        value: score,
        inline: true,
      },
      {
        name: "Accuracy",
        value: accuracy,
        inline: true,
      },
      {
        name: "Money",
        value: points,
        inline: true,
      },
    );
}
