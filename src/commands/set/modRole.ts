import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import { prisma } from "../../db";
import { embedSuccess } from "../../utils";

export const builder = new SlashCommandSubcommandBuilder()
  .setName("mod-role")
  .setDescription("Sets the role which can access additional commands.")
  .addRoleOption(option =>
    option.setName("role").setDescription("The role to set."),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const role = interaction.options.getRole("role");

  if (!role) {
    await prisma.guild.update({
      where: { guildId: interaction.guildId },
      data: { modRoleId: "" },
    });

    return interaction.reply({
      embeds: [
        embedSuccess
          .setTitle("Mod Role disabled.")
          .setDescription(
            "The moderator role has been turned off now.\nOnly the owner of this server can use moderator-only commands now.",
          ),
      ],
    });
  }

  const result = await prisma.guild.update({
    where: { guildId: interaction.guildId },
    data: { modRoleId: role.id },
  });

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Mod role set.")
        .setDescription(
          `The mod role has been set to <@&${result.modRoleId}>.`,
        ),
    ],
  });
}
