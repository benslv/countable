import { embedSuccess } from "../../utils";

export function execute(interaction, gdb) {
  const roleID = interaction.options.getRole("role").id;

  gdb.set("modRoleID", roleID);

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Mod role set.")
        .setDescription(`The mod role has been set to <@&${roleID}>.`),
    ],
  });
}
