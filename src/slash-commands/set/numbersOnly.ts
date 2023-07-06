import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { embedSuccess } from "../../utils";

export const builder = new SlashCommandSubcommandBuilder()
  .setName("numbers-only")
  .setDescription(
    "Sets whether messages are allowed to contain a message after their number count.",
  )
  .addStringOption(option =>
    option
      .setName("enabled")
      .setDescription("On/Off")
      .addChoices({ name: "On", value: "on" }, { name: "Off", value: "off" })
      .setRequired(true),
  );

export function execute(interaction: ChatInputCommandInteraction, gdb) {
  const enabled = interaction.options.getString("enabled") === "on";

  gdb.set("numbersOnly", enabled);

  if (enabled) {
    return interaction.reply({
      embeds: [
        embedSuccess
          .setTitle("Numbers-only mode enabled.")
          .setDescription("Messages must only contain the count now."),
      ],
    });
  }

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Numbers-only mode disabled.")
        .setDescription("Messages are now allowed extra text after the count."),
    ],
  });
}
