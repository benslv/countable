import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { embedError, embedSuccess } from "../../utils";

export const builder = new SlashCommandSubcommandBuilder()
  .setName("save-price")
  .setDescription("Sets the price for buying save points.")
  .addIntegerOption(option =>
    option
      .setName("price")
      .setDescription("The price to set saves as.")
      .setRequired(true),
  );

export function execute(interaction: ChatInputCommandInteraction, gdb) {
  const price = interaction.options.getInteger("price");

  if (price < 0) {
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

  gdb.set("savePrice", price);

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Price updated!")
        .setDescription(
          `The price of a save point has been updated to \`${price}\``,
        ),
    ],
  });
}
