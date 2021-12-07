import { MessageEmbed } from "discord.js";
import { userT } from "./@types/guild";

/**
 Regex testing for a string being a number (more specifically, consisting only of digits).
 */
export function isNumber(s: string): boolean {
  return /^\d+$/.test(s);
}

export function getUserScore(user: userT): number {
  return user.correct - user.incorrect;
}

export function findClosestSave(saves: number[], currentCount: number): number {
  // Look through the list of saves to find the largest valid one (i.e. still smaller than the current count)
  for (const save of saves) {
    if (save <= currentCount) {
      return save;
    }
  }

  // If no valid save points found, return 0 (i.e. back to the start)
  return 0;
}

export function removeSave(saves: number[], save: number): number[] {
  const index = saves.indexOf(save);
  const copySaves = [...saves];

  if (index !== -1) {
    copySaves.splice(index, 1);
  }

  return copySaves;
}

export const embedSuccess = new MessageEmbed()
  .setColor("#4aeb47")
  .setTimestamp();

export const embedInfo = new MessageEmbed().setColor("#ffa630").setTimestamp();

export const embedError = new MessageEmbed().setColor("#e84855").setTimestamp();
