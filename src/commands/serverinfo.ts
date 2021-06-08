import { Message } from "discord.js";
import { execute_args, metadata_t } from "../handlers/commands";
import { embed } from "../utils";

export const metadata: metadata_t = {
  name: "serverinfo",
  aliases: ["info", "server"],
  checkArgs: () => true,
  usage: "",
  guildOnly: true,
  ownerOnly: false,
  description:
    "Display a bunch of useful/interesting information about the current server.",
};

export async function execute({ message, gdb }: execute_args): Promise<Message> {
  const {
    prefix,
    nextCount,
    highestCount,
    prevUserID,
    emojiID,
    milestones,
    users,
  } = gdb;

  const prevUser = await message.client.users.fetch(prevUserID);

  const emoji = message.client.emojis.cache.get(emojiID);

  return message.channel.send({
    embed: embed(
      message,
      {
        type: "info",
        title: `Info about ${message.guild.name}`,
        description: "Here's everything I could find!",
        thumbnail: {
          url: message.guild.iconURL({ size: 128 }),
        },
        fields: [
          { name: "Next count", value: nextCount, inline: true },
          { name: "Highest count", value: highestCount, inline: true },
          {
            name: "Most recent counter",
            value: prevUser,
            inline: true,
          },
          {
            name: "# Milestones",
            value: Object.keys(milestones).length,
            inline: true,
          },
          {
            name: "# Counters",
            value: Object.keys(users).length,
            inline: true,
          },
          {
            name: "Reaction emoji",
            value: emoji,
            inline: true,
          },
          {
            name: "Prefix",
            value: prefix,
            inline: true,
          },
        ],
      },
      true,
    ),
  });
};
