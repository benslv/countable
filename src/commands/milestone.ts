import { SlashCommandBuilder } from "@discordjs/builders";

import { guildDB } from "../@types/guild";
import { embedError, embedInfo, embedSuccess } from "../utils";

const info = {
  name: "milestone",
  aliases: [],
  description: "Commands related to adding/removing/listing milestones.",
  checkArgs: (args: unknown[]) => args.length >= 1,
  guildOnly: true,
  ownerOnly: true,
  usage: "<action> <value/s>",
};

export const metadata = new SlashCommandBuilder()
  .setName(info.name)
  .setDescription(info.description)
  .addSubcommand(subcommand =>
    subcommand
      .setName("list")
      .setDescription("List the milestones in the server."),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("add")
      .setDescription("Add a milestone to the server.")
      .addIntegerOption(option =>
        option
          .setName("count")
          .setDescription("The count to add the milestone at.")
          .setRequired(true),
      )
      .addStringOption(option =>
        option
          .setName("name")
          .setDescription("The name to change the channel to.")
          .setRequired(true),
      ),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("remove")
      .setDescription("Remove a milestone from the server.")
      .addIntegerOption(option =>
        option
          .setName("count")
          .setDescription("The count to remove a milestone from.")
          .setRequired(true),
      ),
  );

export async function execute(interaction, gdb: guildDB) {
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case "list":
      return listMilestones(interaction, gdb);
    case "add":
      return addMilestone(interaction, gdb);
    case "remove":
      return removeMilestone(interaction, gdb);
  }
}

function listMilestones(interaction, gdb) {
  const milestones = gdb.get("milestones");

  if (Object.keys(milestones).length === 0) {
    return interaction.reply({
      embeds: [embedError.setDescription("No milestones found.")],
    });
  }

  const milestoneFields = [];

  for (const key in milestones) {
    milestoneFields.push({ name: key, value: milestones[key], inline: true });
  }

  return interaction.reply({
    embeds: [
      embedInfo
        .setTitle("Server Milestones")
        .setDescription(
          "Here are the milestones you have set up in your server!",
        )
        .setThumbnail(interaction.guild.iconURL())
        .addFields(milestoneFields),
    ],
  });
}

function addMilestone(interaction, gdb) {
  const count = interaction.options.getInteger("count");
  const name = interaction.options.getString("name");

  gdb.set(`milestones.${count}`, name);

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Milestone added!")
        .setDescription(
          `Milestone of **#${name}** was added at count \`${count}\`!`,
        ),
    ],
  });
}

function removeMilestone(interaction, gdb) {
  const count = interaction.options.getInteger("count");

  const milestones = gdb.get("milestones");

  delete milestones[count];

  return interaction.reply({
    embeds: [
      embedSuccess
        .setTitle("Milestone removed!")
        .setDescription(`Any milestones at ${count} have been removed.`),
    ],
  });
}
