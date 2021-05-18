const Enmap = require("enmap");

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
  users: [], // (future) statistics about each user (id, number of correct counts etc.)
};

module.exports = {
  settings: new Enmap({
    name: "settings",
    fetchAll: false,
    autoFetch: true,
    cloneLevel: "deep",
  }),
  guild: function (id) {
    return this.settings.ensure(id, { ...guildTemplate, id });
  },
  debug: function () {
    return this.settings;
  },
  set: function (id, value, key) {
    this.settings.set(id, value, key);
  },
  get: function (id, key) {
    return this.settings.get(id, key);
  },
};
