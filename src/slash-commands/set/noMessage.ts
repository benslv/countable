import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { embedSuccess } from "../../utils";

export const builder = new SlashCommandSubcommandBuilder()
  .setName("no-message")
  .setDescription(
    "Sets whether or not the bot should react to any counts not containing a message.",
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

  gdb.set("noMessageReaction", enabled);

  if (enabled) {
    return interaction.reply({
      embeds: [
        embedSuccess
          .setTitle("Message reactions enabled.")
          .setDescription(
            "Counts will be reacted to when they don't include a message.",
          ),
      ],
    });
  }

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Message reactions disabled.")
        .setDescription("Counts won't be reacted to anymore."),
    ],
  });
}
