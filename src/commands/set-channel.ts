import { Message } from "discord.js";
import { executeArgs, Metadata } from "../@types/commands";
import { embed } from "../utils";

export const metadata: Metadata = {
  name: "set-channel",
  aliases: ["channel"],
  description:
    "Sets the ID of the counting channel to the ID provided by the user.",
  checkArgs: args => args.length === 1,
  guildOnly: true,
  ownerOnly: true,
  usage: "<channel ID>",
};

export async function execute({ message, gdb }: executeArgs): Promise<Message> {
  const channelMentions = message.mentions.channels;

  if (channelMentions.size === 0) {
    return message.channel.send({
      embeds: [
        embed(message, {
          type: "error",
          title: "Channel not included.",
          description: "Make sure to mention the channel you want me to watch.",
        }),
      ],
    });
  }

  const channelID = channelMentions.first().id;

  // If so, store the new ID in settings.
  gdb.set("channel", channelID);

  return message.channel.send({
    embeds: [
      embed(message, {
        type: "success",
        title: "Channel updated!",
        description: `The counting channel has been set to <#${channelID}>`,
      }),
    ],
  });
}
