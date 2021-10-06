import { Message } from "discord.js";
import { executeArgs, Metadata } from "../@types/commands";
import { embed } from "../utils";

export const metadata: Metadata = {
  name: "set-prefix",
  aliases: ["prefix"],
  checkArgs: args => args.length === 1,
  usage: "<prefix>",
  guildOnly: true,
  ownerOnly: true,
  description: "Sets the prefix for commands in the current server.",
};

export function execute({ message, args, gdb }: executeArgs): Promise<Message> {
  const prefix = args[0];

  gdb.set("prefix", prefix);

  return message.channel.send({
    embeds: [
      embed(message, {
        type: "success",
        title: "Prefix set!",
        description: `This server's prefix has been set to \`${prefix}\`.`,
      }),
    ],
  });
}
