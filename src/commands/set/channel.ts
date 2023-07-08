import {
  SlashCommandSubcommandBuilder,
  ChannelType,
  ChatInputCommandInteraction,
} from "discord.js";
import { prisma } from "../../db";
import { embedSuccess } from "../../utils";

export const builder = new SlashCommandSubcommandBuilder()
  .setName("channel")
  .setDescription("Set the channel for Countable to watch.")
  .addChannelOption(option =>
    option
      .setName("channel")
      .setDescription("The channel tag.")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const channelId = interaction.options.getChannel("channel").id;

  const result = await prisma.guild.update({
    where: { guildId: interaction.guildId },
    data: { channelId },
  });

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Channel updated!")
        .setDescription(
          `The counting channel has been set to <#${result.channelId}>`,
        ),
    ],
  });
}
