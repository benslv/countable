import { ChatInputCommandInteraction } from "discord.js";
import { guildDB } from "../../@types/guild";
import { embedError, embedSuccess } from "../../utils";

export function execute(
  interaction: ChatInputCommandInteraction,
  gdb: guildDB,
) {
  const guildEmojis = interaction.client.emojis.cache;
  const input = interaction.options.getString("emoji");

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const emojiRegex = require("emoji-regex");
  const regex = emojiRegex();

  // An emoji can be passed in three different ways:
  // 😅                             - raw unicode (only for non-custom)
  // <:emoji:750788857565282374>    - custom emote "object"
  // 750788857565282374             - custom emote ID

  // First, try and match a Unicode emoji. Returns null if none found.
  const emoji = regex.exec(input);

  if (emoji) {
    gdb.set("emojiID", emoji[0]);

    return interaction.reply({
      embeds: [
        embedSuccess
          .setTitle("Emoji set!")
          .setDescription(
            `The emoji reaction has been updated and set to ${emoji[0]}`,
          ),
      ],
    });
  } else {
    const emojiID = input.match(/(\d{18})/g);

    if (emojiID && guildEmojis.has(emojiID[0])) {
      const emoji = guildEmojis.get(emojiID[0]);

      gdb.set("emojiID", emojiID[0]);

      return interaction.reply({
        embeds: [
          embedSuccess
            .setTitle("Emoji set!")
            .setDescription(
              `The emoji reaction has been updated and set to ${emoji.toString()}`,
            ),
        ],
      });
    } else {
      return interaction.reply({
        embeds: [
          embedError
            .setTitle("Not found...")
            .setDescription(
              "I couldn't find that emoji in my list. Make sure the ID is correct.",
            ),
        ],
      });
    }
  }
}
