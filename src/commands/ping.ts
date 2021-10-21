import { SlashCommandBuilder } from "@discordjs/builders";

const info = {
  name: "ping",
  aliases: [],
  checkArgs: () => true, // No arguments required, so always valid.
  usage: "",
  guildOnly: false,
  ownerOnly: false,
  description: "Replies to the user to confirm the bot is running correctly!",
};

export const metadata = new SlashCommandBuilder()
  .setName(info.name)
  .setDescription(info.description);

export async function execute(interaction, gdb) {
  await interaction.reply(":ping_pong: Pong!");
}
