import { Message } from "discord.js";
import { guild_db } from "../database/guild";
import { execute_args, metadata_t } from "../handlers/commands";
import { embed } from "../utils";

export const metadata: metadata_t = {
  name: "stats",
  aliases: [],
  description: "Replies to the user to confirm the bot is running correctly!",
  checkArgs: args => args.length == 0 || args.length == 1,
  guildOnly: true,
  ownerOnly: false,
  usage: "<blank> or <user mention>",
};

type user_stats = {
  type: string;
  title: string;
  description: string;
  thumbnail?: { url: string };
  fields?: { name: string; value: number; inline: boolean }[];
};

export async function execute({
  message,
  gdb,
}: execute_args): Promise<Message> {
  const mentions = message.mentions.users;

  let response: user_stats;

  if (mentions.size === 0) {
    response = await getUserStats({ gdb, message, id: message.author.id });
  } else {
    const id = mentions.first().id;
    const userInfo = gdb.users[id];

    if (userInfo) {
      response = await getUserStats({ gdb, message, id });
    } else {
      response = {
        type: "error",
        title: "User not found.",
        description:
          "Sorry, I couldn't find that user.\n\nMake sure you mentioned the correct person.\nPerhaps they haven't done any counting yet?",
      };
    }
  }

  return message.channel.send({ embed: embed(message, response) });
}

async function getUserStats({
  gdb,
  message,
  id,
}: {
  gdb: guild_db;
  message: Message;
  id: string;
}): Promise<user_stats> {
  const correct = gdb.users[id].correct;
  const incorrect = gdb.users[id].incorrect;
  const score = correct - incorrect;
  const accuracy = `${(100 * (correct / (correct + incorrect))).toFixed(2)}%`;
  const points = gdb.users[id].points;

  const user = await message.client.users.fetch(id);

  return {
    type: "info",
    title: `Stats for ${user.tag}`,
    description: "Here are your stats for this server!",
    thumbnail: {
      url:
        user.avatarURL({ size: 128, dynamic: true }) || user.defaultAvatarURL,
    },
    fields: [
      {
        name: "Total Counts",
        value: correct + incorrect,
        inline: true,
      },
      {
        name: "Correct",
        value: correct,
        inline: true,
      },
      {
        name: "Incorrect",
        value: incorrect,
        inline: true,
      },
      {
        name: "Score",
        value: score,
        inline: true,
      },
      {
        name: "Accuracy",
        value: accuracy,
        inline: true,
      },
      {
        name: "Money",
        value: points,
        inline: true,
      },
    ],
  };
}
