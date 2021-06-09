import { Message } from "discord.js";
import { execute_args, metadata_t } from "../handlers/commands";
import { embed } from "../utils";

export const metadata: metadata_t = {
  name: "ping",
  aliases: [],
  checkArgs: () => true, // No arguments required, so always valid.
  usage: "",
  guildOnly: false,
  ownerOnly: false,
  description: "Replies to the user to confirm the bot is running correctly!",
};

export function execute({ message }: execute_args): Promise<Message> {
  return message.channel.send({
    embed: embed(message, {
      type: "success",
      title: "🏓 Pong!",
      description: "Everything seems to be in order.",
    }),
  });
}
