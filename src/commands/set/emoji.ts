import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";

import { prisma } from "../../db";
import { embedError, embedSuccess } from "../../utils";

export const builder = new SlashCommandSubcommandBuilder()
  .setName("emoji")
  .setDescription(
    "Sets the reaction used by the bot when a user sends a count with no message.",
  )
  .addStringOption(option =>
    option
      .setName("emoji")
      .setDescription("The emoji to use.")
      .setRequired(true),
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const input = interaction.options.getString("emoji");

  const emojiRegex = await import("emoji-regex");
  const regex = emojiRegex.default();

  const emoji = regex.exec(input);

  if (emoji) {
    const result = await prisma.guild.update({
      where: { guildId: interaction.guildId },
      data: { reactionEmojiId: emoji[0] },
    });

    return interaction.reply({
      embeds: [
        embedSuccess
          .setTitle("Emoji set!")
          .setDescription(
            `The emoji reaction has been updated and set to ${result.reactionEmojiId}`,
          ),
      ],
    });
  } else {
    const emojiId = input.match(/(\d{18})/g);
    const guildEmojis = interaction.guild.emojis.cache;

    if (emojiId && guildEmojis.has(emojiId[0])) {
      const emoji = guildEmojis.get(emojiId[0]);

      await prisma.guild.update({
        where: { guildId: interaction.guildId },
        data: { reactionEmojiId: emojiId[0] },
      });

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
