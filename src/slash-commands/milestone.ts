import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { guildDB, milestoneT } from "../@types/guild";
import { embedError, embedInfo, embedSuccess } from "../utils";

export const metadata = {
  name: "milestone",
  description: "Manage this server's milestones!",
  modOnly: true,
};

export const data = new SlashCommandBuilder()
  .setName(metadata.name)
  .setDescription(metadata.description)
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
  )
  .setDMPermission(false);

export async function execute(
  interaction: ChatInputCommandInteraction,
  gdb: guildDB,
) {
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

function listMilestones(
  interaction: ChatInputCommandInteraction,
  gdb: guildDB,
) {
  const milestones = gdb.get("milestones");

  if (Object.keys(milestones).length === 0) {
    return interaction.reply({
      embeds: [embedError.setTitle("No milestones found.")],
    });
  }

  const milestoneFields: Array<{
    name: string;
    value: string;
    inline: boolean;
  }> = [];

  for (const key in milestones as milestoneT) {
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

function addMilestone(interaction: ChatInputCommandInteraction, gdb: guildDB) {
  const count = interaction.options.getInteger("count");
  const name = interaction.options.getString("name").replace(/\s/g, "-");

  if (count < 0) {
    return interaction.reply({
      embeds: [
        embedError
          .setTitle("Invalid count.")
          .setDescription("Counts must be a positive integer."),
      ],
    });
  }

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

function removeMilestone(
  interaction: ChatInputCommandInteraction,
  gdb: guildDB,
) {
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
