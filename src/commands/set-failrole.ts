import { Message } from "discord.js";
import { execute_args, metadata_t } from "../handlers/commands";
import { embed } from "../utils";

export const metadata: metadata_t = {
  name: "set-failrole",
  aliases: ["failrole"],
  checkArgs: args => args.length == 0 || args.length == 1,
  usage: "",
  guildOnly: true,
  ownerOnly: true,
  description:
    "Sets the role to apply to users if they make an incorrect count.",
};

export function execute({
  message,
  gdb,
  args,
}: execute_args): Promise<Message> {
  const mentions = message.mentions.roles;

  // Disable fail role
  if (mentions.size === 0) {
    gdb.set("failRoleID", "");

    return message.channel.send({
      embed: embed(message, {
        type: "success",
        title: "Fail Role Disabled",
        description: "The fail role has been turned off now.",
      }),
    });
  }

  const id = mentions.first().id;

  if (id) {
    gdb.set("failRoleID", id);

    return message.channel.send({
      embed: embed(message, {
        type: "success",
        title: "Fail Role Enabled",
        description: `The fail role has been set to <@&${id}>.`,
      }),
    });
  }
}
