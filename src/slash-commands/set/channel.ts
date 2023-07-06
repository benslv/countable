import {
  ChannelType,
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import { guildDB } from "../../@types/guild";
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

export function execute(
  interaction: ChatInputCommandInteraction,
  gdb: guildDB,
) {
  const channelID = interaction.options.getChannel("channel").id;

  gdb.set("channel", channelID);

  interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Channel updated!")
        .setDescription(`The counting channel has been set to <#${channelID}>`),
    ],
  });
}
