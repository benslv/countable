import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { embedSuccess } from "../../utils";

export const builder = new SlashCommandSubcommandBuilder()
  .setName("fail-role")
  .setDescription(
    "Sets the role to apply to a user who makes an incorrect count.",
  )
  .addRoleOption(option =>
    option.setName("role").setDescription("The role to set."),
  );

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
