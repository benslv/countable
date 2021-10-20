import { Message, CommandInteraction } from "discord.js";
import { guildDB } from "../@types/guild";
import { commands } from "../commands";

export async function commandHandler(
  interaction: CommandInteraction,
  gdb: guildDB,
): Promise<void | Message> {
  // Pop the first item from args to use as the command name.
  const commandName = interaction.commandName;

  // Retrieve the contents of the command (this will return nothing if the command doesn't exist).
  const command = commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);

    await interaction.reply({
      content:
        err.message ||
        "Sorry, there was an error while executing this command!",
      ephemeral: true,
    });
  }
}
