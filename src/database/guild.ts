import { db } from "./index";
import { userT, guildDB } from "../@types/guild";

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
  savePrice: 500,
  saves: [], // array of counts at which there exists a save point. Multiple saves can exist on the same count, and will be used up one at a time.
  failRoleID: "", // id of the role to assign to a user when they make an incorrect count
  failUserID: "", // id of the user that most recently had the fail role assigned.
  correctCounts: 0,
  modRoleID: "", // id of the role for bot moderators
};

const userTemplate: userT = {
  id: "",
  correct: 0, // number of correct count
  incorrect: 0, // number of incorrect counts
  points: 0, // (future) a "currency" system for users, earned by counting
};

export const database = {
  getGuild: getGuild,
};

function getGuild(id: string): guildDB {
  return {
    ...db.settings.ensure(id, { ...guildTemplate, id }),
    set: (key, value) => {
      db.settings.set(id, value, key);
    },
    get: key => db.settings.get(id, key),
    inc: key => {
      db.settings.inc(id, key);
    },
    getUser: user => {
      return db.settings.ensure(
        id,
        {
          ...userTemplate,
          id: user.id.toString(),
        },
        `users.${user.id}`,
      );
    },
    addUser: user => {
      db.settings.set(
        id,
        { ...userTemplate, id: user.id.toString() },
        `users.${user.id}`,
      );
    },
    addSave: save => {
      // Retrieve the current saves for the guild (or set it to empty if not already created).
      const guildSaves = db.settings.ensure(id, [], "saves");

      // Push the newest save to the array.
      guildSaves.push(save);

      // Re-sort the array in descending order.
      guildSaves.sort((a: number, b: number) => b - a);

      // Set the value back to the database.
      db.settings.set(id, guildSaves, "saves");
    },
    delete: key => {
      db.settings.delete(id, key);
    },
  };
}
