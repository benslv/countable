import { Message } from "discord.js";
import { executeArgs, Metadata } from "../@types/commands";
import { embed } from "../utils";

export const metadata: Metadata = {
  name: "serverinfo",
  aliases: ["info", "server"],
  checkArgs: () => true,
  usage: "",
  guildOnly: true,
  ownerOnly: false,
  description:
    "Display a bunch of useful/interesting information about the current server.",
};

export async function execute({ message, gdb }: executeArgs): Promise<Message> {
  const {
    prefix,
    nextCount,
    highestCount,
    prevUserID,
    emojiID,
    milestones,
    users,
    saves,
    savePrice,
    correctCounts,
  } = gdb;

  const prevUser = message.client.users.cache.get(prevUserID) || "no-one!";

  const emoji = message.client.emojis.cache.get(emojiID) || "N/A";

  return message.channel.send({
    embeds: [
      embed(
        message,
        {
          type: "info",
          title: `Info about ${message.guild.name}`,
          description: "Here's everything I could find!",
          thumbnail: {
            url: message.guild.iconURL({ size: 128 }),
          },
          fields: [
            { name: "Next count", value: nextCount.toString(), inline: true },
            {
              name: "Highest count",
              value: highestCount.toString(),
              inline: true,
            },
            {
              name: "Total counts",
              value: correctCounts.toString(),
              inline: true,
            },
            {
              name: "# Milestones",
              value: Object.keys(milestones).length.toString(),
              inline: true,
            },
            {
              name: "# Counters",
              value: Object.keys(users).length.toString(),
              inline: true,
            },
            { name: "# Saves", value: saves.length.toString(), inline: true },
            { name: "Save price", value: savePrice.toString(), inline: true },
            {
              name: "Reaction emoji",
              value: emoji.toString(),
              inline: true,
            },
            {
              name: "Prefix",
              value: prefix.toString(),
              inline: true,
            },
            {
              name: "Most recent counter",
              value: prevUser.toString(),
              inline: true,
            },
          ],
        },
        true,
      ),
    ],
  });
}
