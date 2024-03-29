import { Message } from "discord.js";
import { executeArgs, Metadata } from "../@types/commands";
import { embed } from "../utils";

export const metadata: Metadata = {
  name: "set-emoji",
  aliases: ["emoji"],
  description:
    "Sets the reaction used by the bot when a user sends a count with no message.",
  checkArgs: args => args.length === 1,
  guildOnly: true,
  ownerOnly: true,
  usage: "<emoji or custom emote you want to use>",
};

export async function execute({
  message,
  args,
  gdb,
}: executeArgs): Promise<Message> {
  // Retrieve all of the emojis the bot has access to.
  const guildEmojis = message.client.emojis.cache;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const emojiRegex = require("emoji-regex");
  const regex = emojiRegex();

  // An emoji can be passed in three different ways:
  // 😅                             - raw unicode (only for non-custom)
  // <:thistbh:750788857565282374>  - custom emote "object"
  // 750788857565282374             - custom emote ID

  // First, try and match a Unicode emoji. Returns null if none found.
  const emoji = regex.exec(args[0]);

  if (emoji) {
    console.log(emoji[0]);

    gdb.set("emojiID", emoji[0]);

    return message.channel.send({
      embeds: [
        embed(message, {
          type: "success",
          title: "Emoji set!",
          description: `The emoji reaction has been updated and set to ${emoji[0]}`,
        }),
      ],
    });
  } else {
    // Otherwise, try and match a custom emote ID.
    const emojiID = args[0].match(/(\d{18})/g);

    if (emojiID && guildEmojis.has(emojiID[0])) {
      const emoji = guildEmojis.get(emojiID[0]);

      gdb.set("emojiID", emojiID[0]);

      return message.channel.send({
        embeds: [
          embed(message, {
            type: "success",
            title: "Emoji set!",
            description: `The emoji reaction has been updated and set to ${emoji.toString()}`,
          }),
        ],
      });
    } else {
      return message.channel.send({
        embeds: [
          embed(message, {
            type: "error",
            title: "Not found...",
            description:
              "I couldn't find that emoji in my list. Make sure the ID is correct.",
          }),
        ],
      });
    }
  }
}
