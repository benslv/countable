import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { embedError, embedSuccess } from "../../utils";

export const builder = new SlashCommandSubcommandBuilder()
  .setName("highest-count")
  .setDescription("Sets the value of the highest-reached count.")
  .addIntegerOption(option =>
    option
      .setName("count")
      .setDescription("The count to use.")
      .setRequired(true),
  );

export function execute(interaction: ChatInputCommandInteraction, gdb) {
  const count = interaction.options.getInteger("count");

  if (count < 0) {
    return interaction.reply({
      embeds: [
        embedError
          .setTitle("Invalid number.")
          .setDescription(
            "Sorry, that's not a valid number. Make sure to use a positive integer!",
          ),
      ],
    });
  }

  gdb.set("highestCount", count);

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Count updated!")
        .setDescription(`The highest count has been updated to \`${count}\``),
    ],
  });
}
