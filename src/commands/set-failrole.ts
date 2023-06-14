import { Message } from "discord.js";
import { executeArgs, Metadata } from "../@types/commands";
import { embed } from "../utils";

export const metadata: Metadata = {
  name: "set-failrole",
  aliases: ["failrole"],
  checkArgs: args => args.length == 0 || args.length == 1,
  usage: "",
  guildOnly: true,
  ownerOnly: true,
  description:
    "Sets the role to apply to users if they make an incorrect count.",
};

export function execute({ message, gdb }: executeArgs): Promise<Message> {
  const roleMentions = message.mentions.roles;

  // Disable fail role
  if (roleMentions.size === 0) {
    gdb.set("failRoleID", "");

    return message.channel.send({
      embeds: [
        embed(message, {
          type: "success",
          title: "Fail Role Disabled",
          description:
            "The fail role has been turned off now.\nTag the role to use if you'd like to turn this feature on!",
        }),
      ],
    });
  }

  const roleID = roleMentions.first().id;

  gdb.set("failRoleID", roleID);

  return message.channel.send({
    embeds: [
      embed(message, {
        type: "success",
        title: "Fail Role Enabled",
        description: `The fail role has been set to <@&${roleID}>.`,
      }),
    ],
  });
}
