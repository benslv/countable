import { SlashCommandBuilder } from "@discordjs/builders";
import { ChannelType } from "discord-api-types";

import * as channel from "./set/channel";
import * as count from "./set/count";
import * as emoji from "./set/emoji";
import * as highestCount from "./set/highestCount";
import * as numbersOnly from "./set/numbersOnly";
import * as savePrice from "./set/savePrice";
import * as failRole from "./set/failRole";
import * as modRole from "./set/modRole";
import * as noMessage from "./set/noMessage";

const info = {
  name: "set",
  description: "Change the settings for Countable in the server.",
};

// I haven't worked out how to do it better than this yet...
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
        option.setName("role").setDescription("The role to set."),
      ),
  )
  .addSubcommand(subcommand =>
    subcommand
      .setName("mod-role")
      .setDescription("Sets the role which can access additional commands.")
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
      return channel.execute(interaction, gdb);
    case "count":
      return count.execute(interaction, gdb);
    case "emoji":
      return emoji.execute(interaction, gdb);
    case "highest-count":
      return highestCount.execute(interaction, gdb);
    case "numbers-only":
      return numbersOnly.execute(interaction, gdb);
    case "save-price":
      return savePrice.execute(interaction, gdb);
    case "fail-role":
      return failRole.execute(interaction, gdb);
    case "mod-role":
      return modRole.execute(interaction, gdb);
    case "no-message":
      return noMessage.execute(interaction, gdb);
  }
}
