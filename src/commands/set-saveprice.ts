import { Message } from "discord.js";
import { executeArgs, Metadata } from "../@types/commands";
import { isNumber, embed } from "../utils";

export const metadata: Metadata = {
  name: "set-saveprice",
  aliases: ["saveprice"],
  description: "Sets the price for buying save points.",
  checkArgs: args => args.length === 1,
  guildOnly: true,
  ownerOnly: true,
  usage: "<number>",
};

export function execute({ message, args, gdb }: executeArgs): Promise<Message> {
  const price = args[0];

  if (!isNumber(price)) {
    return message.channel.send({
      embed: embed(message, {
        type: "error",
        title: "Invalid number.",
        description:
          "Sorry, that's not a valid number. Make sure to use a positive integer!",
      }),
    });
  }

  gdb.set("savePrice", parseInt(price, 10));

  return message.channel.send({
    embed: embed(message, {
      type: "success",
      title: "Price updated!",
      description: `The price of a save point has been updated to \`${price}\``,
    }),
  });
}
