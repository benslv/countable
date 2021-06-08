import { Message } from "discord.js";
import { execute_args, metadata_t } from "../handlers/commands";
import { embed } from "../utils";

export const metadata: metadata_t = {
  name: "set-prefix",
  aliases: [],
  checkArgs: args => args.length === 1,
  usage: "<prefix>",
  guildOnly: true,
  ownerOnly: true,
  description: "Sets the prefix for commands in the current server.",
};

export function execute({ message, args, gdb }: execute_args): Promise<Message> {
  const prefix = args[0];

  gdb.set("prefix", prefix);

  console.log(gdb.get("prefix"));

  return message.channel.send({
    embed: embed(message, {
      type: "success",
      title: "Prefix set!",
      description: `This server's prefix has been set to \`${prefix}\`.`,
    }),
  });
};
