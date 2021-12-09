import { embedSuccess } from "../../utils";

export function execute(interaction, gdb) {
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
