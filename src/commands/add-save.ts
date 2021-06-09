import { Message } from "discord.js";
import { execute_args, metadata_t } from "../handlers/commands";
import { embed } from "../utils";

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
  const savePoint = parseInt(args[0], 10);

  let response: { type: string; title: string; description: string };

  if (savePoint > gdb.nextCount) {
    response = {
      type: "error",
      title: "Save point too high.",
      description: "You can add a save point higher than the current count!",
    };
  } else {
    response = {
      type: "success",
      title: "Save point added!",
      description: `A save point has been added at the count \`${savePoint}\`.`,
    };
  }

  return message.channel.send({
    embed: embed(message, response),
  });
}
