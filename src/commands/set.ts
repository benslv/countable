import { SlashCommandBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction } from "discord.js";

import * as channel from "./set/channel";
import * as count from "./set/count";
import * as emoji from "./set/emoji";
import * as failRole from "./set/failRole";
import * as highestCount from "./set/highestCount";
import * as modRole from "./set/modRole";
// import * as noMessage from "./set/noMessage";
// import * as numbersOnly from "./set/numbersOnly";
// import * as savePrice from "./set/savePrice";

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
  // .addSubcommand(noMessage.builder)
  // .addSubcommand(numbersOnly.builder)
  // .addSubcommand(savePrice.builder)
  .setDMPermission(false);

export async function execute(interaction: ChatInputCommandInteraction) {
  const subcommand = interaction.options.getSubcommand();

  switch (subcommand) {
    case "channel":
      return channel.execute(interaction);
    case "count":
      return count.execute(interaction);
    case "emoji":
      return emoji.execute(interaction);
    case "highest-count":
      return highestCount.execute(interaction);
    // case "numbers-only":
    //   return numbersOnly.execute(interaction);
    // case "save-price":
    //   return savePrice.execute(interaction);
    case "fail-role":
      return failRole.execute(interaction);
    case "mod-role":
      return modRole.execute(interaction);
    // case "no-message":
    //   return noMessage.execute(interaction);
  }
}
