import { ChatInputCommandInteraction } from "discord.js";
import { embedError, embedSuccess } from "../../utils";

export function execute(interaction: ChatInputCommandInteraction, gdb) {
  const price = parseInt(interaction.options.getInteger("price"), 10);

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
