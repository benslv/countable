import { Snowflake, User } from "discord.js";

type emojiID = string;
type guildID = string;
type userID = string;
type timestamp = number;
type failRoleID = string;
type failUserID = string;

type milestoneT = {
  [index: number]: string;
};

export interface userT {
  id: Snowflake;
  correct: number;
  incorrect: number;
  points: number;
}

type valueT = string | number | boolean | milestoneT | object;

export interface Guild {
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
  milestones: milestoneT;
  users: { id: userT };
  savePrice: number;
  saves: number[];
  failRoleID: failRoleID;
  failUserID: failUserID;
  correctCounts: number;

  set: (key: string, value: valueT) => void;
  get: (key: string) => valueT;
  inc: (key: string) => void;
  getUser: (user: User) => userT;
  addUser: (author: User) => void;
  addSave: (save: number) => void;
  delete: (key: string) => void;
}
