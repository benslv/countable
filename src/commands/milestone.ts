import { Message } from "discord.js";
import { guild_db, milestone_t } from "../database/guild";
import { execute_args, metadata_t } from "../handlers/commands";
import { isNumber, embed } from "../utils";

export const metadata: metadata_t = {
  name: "milestone",
  aliases: [],
  description: "Commands related to adding/removing/listing milestones.",
  checkArgs: (args: unknown[]) => args.length >= 1,
  guildOnly: true,
  ownerOnly: true,
  usage: "<action> <value/s>",
};

type milestone_function_t = (
  message: Message,
  count: string,
  name: string,
  gdb: guild_db,
) => object;

enum ErrorKind {
  InvalidAction,
  InvalidNumber,
  NoMilestones,
  MissingName,
}

export function execute({
  args,
  message,
  gdb,
}: execute_args): Promise<Message> {
  try {
    const action: milestone_function_t = (arg => {
      switch (arg) {
        case "list":
          return listMilestones;
        case "add":
          return addMilestone;
        case "remove":
          return removeMilestone;
        default:
          throw ErrorKind.InvalidAction;
      }
    })(args[0].toLowerCase());

    const values = args.slice(1);

    const response = action(message, values[0], values[1], gdb);

    return message.channel.send({ embed: embed(message, { ...response }) });
  } catch (e) {
    const error_message = (() => {
      switch (e) {
        case ErrorKind.InvalidAction:
          return {
            type: "error",
            title: "Invalid action.",
            description:
              "Sorry! That isn't a valid action for this command.\nValid actions are: `list`, `add`, `remove`",
          };
        case ErrorKind.InvalidNumber:
          return {
            type: "error",
            title: "Invalid number.",
            description:
              "Milestones can only be added at positive integers :grimacing:",
          };
        case ErrorKind.NoMilestones:
          return {
            type: "info",
            title: "Server Milestones",
            description:
              "You haven't got any milestones set up in this server 😭\n\nUse the command `milestone add` to create some!",
            thumbnail: { url: message.guild.iconURL() },
          };
        case ErrorKind.MissingName:
          return {
            type: "error",
            title: "No name provided.",
            description: "Please provide a name for the milestone.",
          };
        default:
          throw e;
      }
    })();

    return message.channel.send({
      embed: embed(message, error_message),
    });
  }
}

function listMilestones(
  message: Message,
  _count: unknown,
  _name: unknown,
  gdb: guild_db,
): object {
  const milestones = gdb.get("milestones") as milestone_t;

  if (Object.keys(milestones).length === 0) {
    throw ErrorKind.NoMilestones;
  }

  console.log("Listing milestones:\n", milestones);

  const milestoneFields = [];

  for (const key in milestones) {
    milestoneFields.push({ name: key, value: milestones[key], inline: true });
  }

  return {
    type: "info",
    title: "Server Milestones",
    description: "Here are the milestones you have set up in your server!",
    thumbnail: { url: message.guild.iconURL() },
    fields: milestoneFields,
  };
}

function addMilestone(
  _message: unknown,
  count: string,
  name: string,
  gdb: guild_db,
): object {
  if (!isNumber(count)) {
    throw ErrorKind.InvalidNumber;
  }

  if (!name) {
    throw ErrorKind.MissingName;
  }

  gdb.set(`milestones.${count}`, name);

  console.log(
    `Added title milestone of ${name} at count ${count}.\n`,
    gdb.get("milestones"),
  );

  return {
    type: "success",
    title: "Milestone added!",
    description: `Milestone of **#${name}** was added at count \`${count}\`!`,
  };
}

function removeMilestone(
  _message: Message,
  count: string,
  _name: unknown,
  gdb: guild_db,
): object {
  if (!isNumber(count)) {
    throw ErrorKind.InvalidNumber;
  }

  const milestones = gdb.get("milestones");

  delete milestones[count];

  console.log(
    `Delete title milestone from count ${count}.\n`,
    gdb.get("milestones"),
  );

  return {
    type: "success",
    title: "Milestone added!",
    description: `Any milestones have been deleted from count \`${count}\`!`,
  };
}
