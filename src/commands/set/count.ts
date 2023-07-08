import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import { embedError, embedSuccess } from "../../utils";
import { prisma } from "../../db";

export const builder = new SlashCommandSubcommandBuilder()
  .setName("count")
  .setDescription("Set the value of the next expected count.")
  .addIntegerOption(option =>
    option
      .setName("count")
      .setDescription("The count to use.")
      .setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const count = interaction.options.getInteger("count");

  if (count < 0) {
    return interaction.reply({
      embeds: [
        embedError
          .setTitle("Invalid number.")
          .setDescription(
            "Sorry, that's not a valid number. Make sure to use a positive integer!",
          ),
      ],
    });
  }

  const result = await prisma.guild.update({
    where: { guildId: interaction.guildId },
    data: { count },
  });

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Count updated!")
        .setDescription(
          `The next expected count has been updated to \`${result.count}\``,
        ),
    ],
  });
}
