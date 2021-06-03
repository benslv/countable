const db = require("./index");

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
};

const userTemplate = {
  id: "",
  correct: 0, // number of correct count
  incorrect: 0, // number of incorrect counts
  points: 0, // (future) a "currency" system for users, earned by counting
};

module.exports = id => {
  return {
    ...db.settings.ensure(id, { ...guildTemplate, id }),
    set: (key, value) => {
      db.settings.set(id, value, key);
    },
    get: key => {
      return db.settings.get(id, key);
    },
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
    addSave: save => {
      // Retrieve the current saves for the guild.
      const guildSaves = db.settings.ensure(id, [], "saves");

      // Push the newest save to the array.
      guildSaves.push(save);

      // Re-sort the array in descending order.
      guildSaves.sort((a, b) => b - a);

      // Set the value back to the database.
      db.settings.set(id, guildSaves, "saves");
    },
    delete: key => {
      db.settings.delete(id, key);
    },
  };
};
