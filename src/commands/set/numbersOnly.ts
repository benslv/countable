import { embedSuccess } from "../../utils";

export function execute(interaction, gdb) {
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
