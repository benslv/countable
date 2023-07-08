import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { embedInfo, embedSuccess } from "../utils";

export const metadata = {
  name: "ping",
  description: "Replies with pong!",
  modOnly: false,
};

export const data = new SlashCommandBuilder()
  .setName(metadata.name)
  .setDescription(metadata.description);

export async function execute(interaction: ChatInputCommandInteraction) {
  const reply = await interaction.reply({
    embeds: [embedInfo.setTitle("Pinging...")],
    fetchReply: true,
  });

  const diff = reply.createdTimestamp - interaction.createdTimestamp;

  reply.edit({
    embeds: [
      embedSuccess
        .setTitle("🏓 Pong!")
        .setDescription(`Replied in \`${diff}\` ms`),
    ],
  });
}
