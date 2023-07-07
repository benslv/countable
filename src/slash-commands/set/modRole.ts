import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { embedSuccess } from "../../utils";

export const builder = new SlashCommandSubcommandBuilder()
  .setName("mod-role")
  .setDescription("Sets the role which can access additional commands.")
  .addRoleOption(option =>
    option.setName("role").setDescription("The role to set.").setRequired(true),
  );

export function execute(interaction: ChatInputCommandInteraction, gdb) {
  const roleID = interaction.options.getRole("role").id;

  gdb.set("modRoleId", roleID);

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Mod role set.")
        .setDescription(`The mod role has been set to <@&${roleID}>.`),
    ],
  });
}
