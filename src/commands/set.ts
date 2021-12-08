import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types";

import { execute as channelExecute } from "./set/channel";

const info = {
  name: "set",
  description: "Change the settings for Countable in the server.",
};

export const metadata = new SlashCommandBuilder()
  .setName(info.name)
  .setDescription(info.description)
  .addSubcommand(subcommand =>
    subcommand
      .setName("channel")
      .setDescription("Set the channel for Countable to watch.")
      .addChannelOption(option =>
        option
          .setName("channel")
          .setDescription("The channel tag.")
          .addChannelType(ChannelType.GuildText)
          .setRequired(true),
      ),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("count")
      .setDescription("Set the value of the next expected count.")
      .addIntegerOption(option =>
        option
          .setName("count")
          .setDescription("The count to use.")
          .setRequired(true),
      ),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("emoji")
      .setDescription(
        "Sets the reaction used by the bot when a user sends a count with no message.",
      )
      .addStringOption(option =>
        option
          .setName("emoji")
          .setDescription("The emoji to use.")
          .setRequired(true),
      ),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("fail-role")
      .setDescription(
        "Sets the role to apply to a user who makes an incorrect count.",
      )
      .addRoleOption(option =>
        option
          .setName("role")
          .setDescription("The role to set.")
          .setRequired(true),
      ),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("highest-count")
      .setDescription("Sets the value of the highest-reached count.")
      .addIntegerOption(option =>
        option
          .setName("count")
          .setDescription("The count to use.")
          .setRequired(true),
      ),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("no-message")
      .setDescription(
        "Sets whether or not the bot should react to any counts not containing a message.",
      )
      .addStringOption(option =>
        option
          .setName("enabled")
          .setDescription("On/Off")
          .addChoice("On", "on")
          .addChoice("Off", "off")
          .setRequired(true),
      ),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("numbers-only")
      .setDescription(
        "Sets whether messages are allowed to contain a message after their number count.",
      )
      .addStringOption(option =>
        option
          .setName("enabled")
          .setDescription("On/Off")
          .addChoice("On", "on")
          .addChoice("Off", "off")
          .setRequired(true),
      ),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("save-price")
      .setDescription("Sets the price for buying save points.")
      .addIntegerOption(option =>
        option
          .setName("price")
          .setDescription("The price to set saves as.")
          .setRequired(true),
      ),
  );

export function execute(interaction, gdb) {
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case "channel":
      return channelExecute(interaction, gdb);
  }
}
