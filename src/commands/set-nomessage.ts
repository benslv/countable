import { Message } from "discord.js";
import { execute_args, metadata_t } from "../handlers/commands";
import { embed } from "../utils";

export const metadata: metadata_t = {
  name: "set-nomessage",
  aliases: ["nomessage"],
  description:
    "Sets whether or not the bot should react to any counts not containing a message.",
  checkArgs: args => args.length === 1,
  guildOnly: true,
  ownerOnly: true,
  usage: "<true|false>",
};

enum ErrorKind {
  InvalidArgument,
}

export function execute({
  message,
  args,
  gdb,
}: execute_args): Promise<Message> {
  try {
    const arg = (a => {
      switch (a) {
        case "true":
          return true;
        case "false":
          return false;
        default:
          throw ErrorKind.InvalidArgument;
      }
    })(args[0].toLowerCase());

    gdb.set("noMessageReaction", arg);

    console.log(`Set "no message reaction" to ${arg}.`);

    return message.channel.send({
      embed: embed(message, {
        type: "success",
        title: `Message reactions ${arg ? "en" : "dis"}abled.`,
        description: `Messages now **${
          arg ? "will" : "won't"
        }** be reacted to when left empty.`,
      }),
    });
  } catch (e) {
    switch (e) {
      case ErrorKind.InvalidArgument:
        return message.channel.send({
          embed: embed(message, {
            type: "error",
            title: "Invalid input.",
            description:
              "That's not a valid argument. Please enter `true` or `false`.",
          }),
        });
      default:
        throw e;
    }
  }
}
