import { GuildMember, Message, Snowflake, User } from "discord.js";
import { db } from "./index";

const guildTemplate = {
  id: "", // ID of the guild
  prefix: "`", // prefix to use the bot
  channel: "", // ID of the counting channel
  nextCount: 1, // next expected count
  highestCount: 0, // highest count reached
  highestCountID: "", // ID of the message with the highest count
  prevUserID: "", // ID of the previous user to post a correct count
  latestMessage: "", // timestamp of the most recent correct count
  noMessageReaction: false, // whether to add a reaction to any counts which don't contain a message
  emojiID: "", // ID of the emoji to use when reacting to messages
  numbersOnly: false, // whether to enforce "numbers only" in the counting channel
  milestones: {}, // which channel-renaming milestones have been set up by the guild
  users: {}, // (future) statistics about each user (id, number of correct counts etc.)
  set: undefined,
  get: undefined,
  inc: undefined,
  addUser: undefined,
  delete: undefined,
};

export type user_t = {
  id: Snowflake;
  correct: number;
  incorrect: number;
  points: number;
};

const userTemplate: user_t = {
  id: "",
  correct: 0, // number of correct count
  incorrect: 0, // number of incorrect counts
  points: 0, // (future) a "currency" system for users, earned by counting
};

type emojiID = string;
type guildID = string;
type userID = string;
type timestamp = number;

export type milestone_t = {
  [index: number]: string;
};

type value_t = string | number | boolean | milestone_t | object;

export type guild_db = {
  id: guildID;
  prefix: string;
  channel: string;
  nextCount: number;
  highestCount: number;
  highestCountID: userID;
  prevUserID: userID;
  latestMessage: timestamp;
  noMessageReaction: boolean;
  emojiID: emojiID;
  numbersOnly: false;
  milestones: milestone_t;
  users: { id: user_t };

  set: (key: string, value: value_t) => void;
  get: (key: string) => value_t;
  inc: (key: string) => void;
  addUser: (author: User) => void;
  delete: (key: string) => void;
};

export const database = {
  getGuild: database_getGuild,
};

function database_getGuild(id: string): guild_db {
  return {
    ...db.settings.ensure(id, { ...guildTemplate, id }),
    set: (key, value) => {
      db.settings.set(id, value, key);
    },
    get: key => db.settings.get(id, key),
    inc: key => {
      db.settings.inc(id, key);
    },
    addUser: author => {
      db.settings.set(
        id,
        { ...userTemplate, id: author.id.toString() },
        `users.${author.id}`,
      );
    },
    delete: key => {
      db.settings.delete(id, key);
    },
  };
}
