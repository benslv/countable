import { Message } from "discord.js";
import { guildDB } from "../@types/guild";

export interface executeArgs {
  message: Message;
  gdb: guildDB;
  args?: string[];
}

type executeT = (_: executeArgs) => Promise<Message>;

export interface Metadata {
  name: string;
  aliases: string[];
  description: string;
  checkArgs: (() => boolean) | ((args: string[]) => boolean);
  guildOnly: boolean;
  ownerOnly: boolean;
  usage: string;
}

export interface Command {
  metadata: Metadata;
  execute: executeT;
}
