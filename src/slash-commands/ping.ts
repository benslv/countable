import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { embedSuccess } from "../utils";

export const metadata = {
  name: "ping",
  description: "Replies with pong!",
  modOnly: false,
};

export const data = new SlashCommandBuilder()
  .setName(metadata.name)
  .setDescription(metadata.description);

export async function execute(interaction: ChatInputCommandInteraction) {
  const now = Date.now();
  const diff = interaction.createdTimestamp - now;

  await interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("🏓 Pong!")
        .setDescription(`Replied in \`${diff}\` ms`),
    ],
  });
}
