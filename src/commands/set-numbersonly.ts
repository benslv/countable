import { Message } from "discord.js";
import { execute_args, metadata_t } from "../handlers/commands";
import { embed } from "../utils";

export const metadata: metadata_t = {
  name: "set-numbersonly",
  aliases: ["numbersonly"],
  description:
    "Sets whether messages are allowed to contain a message after their number count.",
  checkArgs: args => args.length === 1,
  guildOnly: true,
  ownerOnly: true,
  usage: "<true|false>",
};

enum ErrorKind {
  InvalidArgument
}

export function execute({ message, args, gdb }: execute_args): Promise<Message> {
  try {
    const arg = ((a) => {
      switch (a) {
        case "true": return true;
        case "false": return false;
        default:
          throw ErrorKind.InvalidArgument;
      }
    })(args[0].toLowerCase());

    gdb.set("numbersOnly", arg);

    console.log(`Set numbers only to ${arg}.`);

    return message.channel.send({
      embed: embed(message, {
        type: "success",
        title: `Numbers-only mode ${arg ? "en" : "dis"}abled.`,
        description: `Counts now **are${arg ? "n't" : ""}** allowed a message after them.`,
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
};
