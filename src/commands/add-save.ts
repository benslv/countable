import { Message } from "discord.js";
import { execute_args, metadata_t } from "../handlers/commands";
import { embed, isNumber } from "../utils";

export const metadata: metadata_t = {
  name: "add-save",
  aliases: ["save"],
  checkArgs: args => args.length === 1,
  usage: "<",
  guildOnly: false,
  ownerOnly: false,
  description: "Replies to the user to confirm the bot is running correctly!",
};

export function execute({
  message,
  gdb,
  args,
}: execute_args): Promise<Message> {
  // Save point is not a positive integer.
  if (!isNumber(args[0])) {
    return message.channel.send({
      embed: embed(message, {
        type: "error",
        title: "Invalid number.",
        description:
          "Sorry, that's not a valid number. Make sure to use a positive integer!",
      }),
    });
  }

  const savePoint = parseInt(args[0], 10);
  const user = gdb.getUser(message.author);

  // User doesn't have enough points to buy a save.
  if (user.points < gdb.savePrice) {
    return message.channel.send({
      embed: embed(message, {
        type: "error",
        title: "Not enough points",
        description:
          "You haven't got enough points to buy a save.\nDo some counting to collect more!",
      }),
    });
  }

  // User enters an invalid save point (too high).
  if (savePoint > gdb.nextCount) {
    return message.channel.send({
      embed: embed(message, {
        type: "error",
        title: "Save point too high.",
        description:
          "You can't add a save point higher than the current count!",
      }),
    });
  }

  // Save point is valid.
  gdb.addSave(savePoint); // add the save
  gdb.set(`users.${message.author.id}`, user.points - gdb.savePrice); // subtract the points from the user

  return message.channel.send({
    embed: embed(message, {
      type: "success",
      title: "Save point added!",
      description: `A save point has been added at the count \`${savePoint}\`.`,
    }),
  });
}
