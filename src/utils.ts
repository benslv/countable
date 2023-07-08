import { EmbedBuilder } from "discord.js";

export function isDigits(maybeNumber: string) {
  const regex = /\d+/;

  return regex.test(maybeNumber);
}

export const embedSuccess = new EmbedBuilder()
  .setColor("#4aeb47")
  .setTimestamp();

export const embedInfo = new EmbedBuilder().setColor("#ffa630").setTimestamp();

export const embedError = new EmbedBuilder().setColor("#e84855").setTimestamp();
