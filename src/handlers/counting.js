const utils = require("../utils");

module.exports = ({ message, gdb }) => {
  // Split the message up into parts.
  const messageSplit = message.content.split(/[ :\n]+/);
  let messageNumber = messageSplit[0];

  // Delete the message if it doesn't start with a number.
  if (!utils.isNumber(messageNumber)) {
    return message.delete();
  }

  // Convert user input to a base-10 integer.
  messageNumber = parseInt(messageNumber, 10);

  // Compare the author id of the current message to that of the previous message sent.
  if (message.author.id === gdb.prevUserID) {
    return message.delete().catch(err => console.error(err));
  }

  // Store the id of the user to prevent consecutive entries by the same user.
  gdb.set("prevUserID", message.author.id);

  // Check that the start of the message equals the expected count value,
  // or that a message was not included with the count if it was correct and numbersOnly is true.
  if (
    (messageSplit.length > 1 && gdb.numbersOnly) ||
    messageNumber !== gdb.nextCount
  ) {
    message.channel.send(
      `:boom: **Wrong number, ${message.author.toString()}!**`,
    );

    gdb.set("nextCount", 1);

    if (!gdb.users[message.member.id]) {
      gdb.addUser(message.member);
    }

    gdb.inc(`users.${message.member.id}.incorrect`);
    // Fetch the message-to-be-pinned by its ID, and then pin it.
    message.channel.messages
      .fetch(gdb.highestCountID)
      .then(message => {
        if (!message.pinned) message.pin().catch(err => console.error(err));
      })
      .catch(err => console.error(err));

    return;
  }

  // Save the timestamp of the latest valid message.
  gdb.set("latestMessage", message.createdTimestamp);

  // Increment the expected count.
  gdb.inc("nextCount");

  if (!gdb.users[message.member.id]) {
    gdb.addUser(message.member);
  }

  gdb.inc(`users.${message.member.id}.correct`);

  // Update the highest score for the server, to keep track of when to pin.
  if (messageNumber > gdb.highestCount) {
    // gdb.inc(message.guild.id, "highestCount");
    gdb.set("highestCount", messageNumber);

    // Store the id of the new highest message.
    gdb.set("highestCountID", message.id);
  }

  // If a user sends a number without any message following it, and without an attachment...
  if (
    messageSplit.length <= 1 &&
    gdb.noMessageReaction &&
    message.attachments.size == 0
  ) {
    // React to it with the :npc: emote (custom emote in the 8-Ball server).
    message.react(gdb.emojiID).catch(err => console.error(err));
  }

  // If the most recently counted number reached a new title milestone, change the counting
  // channel title.
  if (Object.prototype.hasOwnProperty.call(gdb.milestones, messageNumber)) {
    message.client.channels.cache
      .get(gdb.channel)
      .setName(gdb.milestones[messageNumber]);

    console.log(
      `Set name of counting channel to ${gdb.milestones[messageNumber]}.`,
    );
  }

  return;
};
