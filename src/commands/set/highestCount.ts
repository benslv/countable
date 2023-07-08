import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import { prisma } from "../../db";
import { embedSuccess } from "../../utils";

export const builder = new SlashCommandSubcommandBuilder()
  .setName("highest-count")
  .setDescription("Sets the value of the highest-reached count.")
  .addIntegerOption(option =>
    option
      .setName("count")
      .setDescription("The count to use.")
      .setMinValue(0)
      .setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const count = interaction.options.getInteger("count");

  const result = await prisma.guild.update({
    where: { guildId: interaction.guildId },
    data: { highestCount: count },
  });

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Count updated!")
        .setDescription(
          `The highest count has been updated to \`${result.highestCount}\``,
        ),
    ],
  });
}
