import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import { embedSuccess } from "../../utils";
import { prisma } from "../../db";

export const builder = new SlashCommandSubcommandBuilder()
  .setName("fail-role")
  .setDescription(
    "Sets the role to apply to a user who makes an incorrect count.",
  )
  .addRoleOption(option =>
    option.setName("role").setDescription("The role to set."),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const role = interaction.options.getRole("role");

  if (!role) {
    await prisma.guild.update({
      where: { guildId: interaction.guildId },
      data: { failRoleId: "" },
    });

    return interaction.reply({
      embeds: [
        embedSuccess
          .setTitle("Fail Role disabled.")
          .setDescription(
            "The fail role has been turned off now.\nTag the role to use if you'd like to turn this feature on!",
          ),
      ],
    });
  }

  const result = await prisma.guild.update({
    where: { guildId: interaction.guildId },
    data: { failRoleId: role.id },
  });

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Fail Role enabled.")
        .setDescription(
          `The fail role has been set to <@&${result.failRoleId}>.`,
        ),
    ],
  });
}
