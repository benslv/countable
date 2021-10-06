import { Message } from "discord.js";
import { executeArgs, Metadata } from "../@types/commands";
import { embed } from "../utils";

export const metadata: Metadata = {
  name: "ping",
  aliases: [],
  checkArgs: () => true, // No arguments required, so always valid.
  usage: "",
  guildOnly: false,
  ownerOnly: false,
  description: "Replies to the user to confirm the bot is running correctly!",
};

export function execute({ message }: executeArgs): Promise<Message> {
  return message.channel.send({
    embeds: [
      embed(message, {
        type: "success",
        title: "🏓 Pong!",
        description: "Everything seems to be in order.",
      }),
    ],
  });
}
