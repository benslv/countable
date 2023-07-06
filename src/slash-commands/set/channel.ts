import { ChatInputCommandInteraction } from "discord.js";
import { guildDB } from "../../@types/guild";
import { embedSuccess } from "../../utils";

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
