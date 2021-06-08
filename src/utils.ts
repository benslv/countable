import { timeStamp } from "console";
import { EmbedField, Message, MessageEmbed, MessageEmbedAuthor } from "discord.js";
import { user_t } from "./database/guild";

/**
 Regex testing for a string being a number (more specifically, consisting only of digits).
 */
export function isNumber(s: string): boolean {
  return /^\d+$/.test(s);
}

type embed_kind = "INFO" | "ERROR" | "SUCCESS";

// /**
//  * Renders a discord embed
//  */
// export function embed(
//   message: Message,
//   kind: embed_kind,
//   content: Partial<MessageEmbed>,
//   verbose = false,
// ): MessageEmbed {
//   const colour = (() => {
//     switch (kind) {
//       case "INFO": return 0xffa630;
//       case "ERROR": return 0xe84855;
//       case "SUCCESS": return 0x4aeb47;
//     }
//   })();


//   let embed = new MessageEmbed();

//   embed.color = colour;
//   embed = { ...embed, ...content } as MessageEmbed;

//   if (verbose) {
//     embed.footer = {
//       text: `Requested by ${message.author.tag}`,
//       iconURL: message.author.avatarURL(),
//     }
//     embed.timestamp = new Date().getTime() / 1000; // TODO is this meant to be unix?
//   }

//   return embed;
// };

export function embed(
  message,
  { type = "info", title = "", description = "", ...rest },
  verbose = false,
) {
  const types = {
    info: 0xffa630,
    error: 0xe84855,
    success: 0x4aeb47,
  };

  let output = {
    color: types[type],
    title: title,
    description: description,
    ...rest,
  };

  if (verbose) {
    output = {
      ...output,
      // TODO bad. very very bad.
      // @ts-ignore
      footer: {
        text: `Requested by ${message.author.tag}`,
        icon_url: message.author.avatarURL(),
      },
      timestamp: new Date(),
    };
  }

  return output;
};

export function getUserScore(user: user_t) {
  return user.correct - user.incorrect;
}
