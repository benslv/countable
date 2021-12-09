import { SlashCommandBuilder } from "@discordjs/builders";
import { guildDB } from "../@types/guild";
import { embedError, embedInfo, embedSuccess } from "../utils";

const info = {
  name: "save",
  description: "Add or list saves in your server.",
};

export const metadata = new SlashCommandBuilder()
  .setName(info.name)
  .setDescription(info.description)
  .addSubcommand(subcommand =>
    subcommand
      .setName("list")
      .setDescription("List the current save points in the server."),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("add")
      .setDescription("Add a save to the server.")
      .addIntegerOption(option =>
        option
          .setName("count")
          .setDescription("The count to add the save at.")
          .setRequired(true),
      ),
  );

export async function execute(interaction, gdb: guildDB) {
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case "list":
      return listSaves(interaction, gdb);
    case "add":
      return addSave(interaction, gdb);
  }
}

function listSaves(interaction, gdb) {
  const saves = gdb.get("saves");

  return interaction.reply({
    embeds: [
      embedInfo
        .setTitle("Server Saves")
        .setDescription(
          `Here are the save points currently in the server!\n\n${saves.join(
            "\n",
          )}`,
        ),
    ],
  });
}

function addSave(interaction, gdb: guildDB) {
  const count = interaction.options.getInteger("count");

  if (count < 0) {
    return interaction.reply({
      embeds: [
        embedError
          .setTitle("Invalid count.")
          .setDescription("Counts must be a positive integer."),
      ],
    });
  }

  const user = gdb.getUser(interaction.user);

  if (user.points < gdb.savePrice) {
    return interaction.reply({
      embeds: [
        embedError
          .setTitle("Not enough points.")
          .setDescription(
            "You haven't got enough points to buy a save.\nDo some counting to collect more!",
          ),
      ],
    });
  }

  if (count > gdb.nextCount) {
    return interaction.reply({
      embeds: [
        embedError
          .setTitle("Save point too high.")
          .setDescription(
            "You can't add a save point higher than the current count!",
          ),
      ],
    });
  }

  gdb.addSave(count);
  gdb.set(`users.${interaction.user.id}.points`, user.points - gdb.savePrice);

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Save point added!")
        .setDescription(
          `A save point has been added at the count \`${count}\`.`,
        ),
    ],
  });
}
