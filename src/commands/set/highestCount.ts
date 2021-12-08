import { embedError, embedSuccess } from "../../utils";

export function execute(interaction, gdb) {
  const count = interaction.options.getInteger("count");

  if (parseInt(count, 10) < 0) {
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

  gdb.set("highestCount", parseInt(count, 10));

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Count updated!")
        .setDescription(`The highest count has been updated to \`${count}\``),
    ],
  });
}
