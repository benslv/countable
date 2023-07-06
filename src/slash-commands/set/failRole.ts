import { ChatInputCommandInteraction } from "discord.js";
import { embedSuccess } from "../../utils";

export function execute(interaction: ChatInputCommandInteraction, gdb) {
  const roleID = interaction.options.getRole("role").id;

  if (!roleID) {
    gdb.set("failRoleID", "");

    return interaction.reply({
      embeds: [
        embedSuccess
          .setTitle("Fail Role disabled.")
          .setDescription(
            "The fail role has been turned off now.\nTag the role to use if you'd like to turn this feature on!",
          ),
      ],
    });
  }

  gdb.set("failRoleID", roleID);

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Fail Role enabled.")
        .setDescription(`The fail role has been set to <@&${roleID}>.`),
    ],
  });
}
