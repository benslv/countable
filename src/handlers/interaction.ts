import { ChatInputCommandInteraction } from "discord.js";

import { commands } from "../commands";
import { prisma } from "../db";

export async function interactionHandler(
  interaction: ChatInputCommandInteraction,
) {
  const command = commands.get(interaction.commandName);

  if (!command) return;

  const guild = await interaction.guild.fetch();

  const { modRoleId } = await prisma.guild.findUnique({
    where: { guildId: interaction.guildId },
    select: {
      modRoleId: true,
    },
  });

  const modRole = await guild.roles.fetch(modRoleId);
  const modRoleMembers = modRole.members;

  const isOwner = interaction.user.id === interaction.guild.ownerId;

  const canRunModCommands =
    (modRoleId && modRoleMembers.has(interaction.user.id)) || isOwner;

  const isModOnly = command.metadata.modOnly;

  if (isModOnly && !canRunModCommands) {
    await interaction.reply({
      content:
        ":warning: **Permission denied**. You need to be a moderator to do that.",
    });

    return;
  }

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);

    await interaction.reply({
      content:
        err.message ||
        "Sorry, there was an error while executing this command!",
      ephemeral: true,
    });
  }
}
