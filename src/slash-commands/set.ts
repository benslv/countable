import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

import * as channel from "./set/channel";
import * as count from "./set/count";
import * as emoji from "./set/emoji";
import * as failRole from "./set/failRole";
import * as highestCount from "./set/highestCount";
import * as modRole from "./set/modRole";
import * as noMessage from "./set/noMessage";
import * as numbersOnly from "./set/numbersOnly";
import * as savePrice from "./set/savePrice";

export const metadata = {
  name: "set",
  description: "Manage the settings for Countable in the server.",
  modOnly: true,
};

export const data = new SlashCommandBuilder()
  .setName(metadata.name)
  .setDescription(metadata.description)
  .addSubcommand(channel.builder)
  .addSubcommand(count.builder)
  .addSubcommand(emoji.builder)
  .addSubcommand(failRole.builder)
  .addSubcommand(highestCount.builder)
  .addSubcommand(modRole.builder)
  .addSubcommand(noMessage.builder)
  .addSubcommand(numbersOnly.builder)
  .addSubcommand(savePrice.builder)
  .setDMPermission(false);

export function execute(interaction: ChatInputCommandInteraction, gdb) {
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
