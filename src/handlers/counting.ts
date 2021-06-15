import { Channel, Message, TextChannel } from "discord.js";
import { guild_db } from "../database/guild";
import { isNumber, findClosestSave, removeSave } from "../utils";

export async function countingHandler(
  message: Message,
  gdb: guild_db,
): Promise<void | Message> {
  // Split the message up into parts.
  const messageSplit = message.content.split(/[ :\n]+/);
  const messageNumberString = messageSplit[0];

  // Delete the message if it doesn't start with a number.
  if (!isNumber(messageNumberString)) {
    return message.delete();
  }

  // Convert user input to a base-10 integer.
  const messageNumber = parseInt(messageNumberString, 10);

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
    // Check for any valid save points to use.
    const resetPoint = findClosestSave(gdb.saves, gdb.nextCount - 1);

    // Reset the count back to the save point (or 1 if no save was found).
    gdb.set("nextCount", resetPoint + 1);

    const boomMessage = await message.channel.send(
      `:boom: **Wrong number, ${message.author.toString()}!**`,
    );

    // Logic for if a save point was used.
    if (resetPoint !== 0) {
      gdb.set("saves", removeSave(gdb.saves, resetPoint));

      return boomMessage.channel.send({
        embed: {
          description: `**${resetPoint}** That was close! Good thing you had a save! <:save:852972587873206302>`,
        },
      });
    }

    if (!gdb.users[message.author.id]) {
      gdb.addUser(message.author);
    }

    gdb.inc(`users.${message.author.id}.incorrect`);

    // Logic for applying/removing a fail role (if it is set).
    const failRole = message.guild.roles.cache.get(gdb.failRoleID);

    if (failRole) {
      // Remove the fail role from the previous user.
      const prevFailUser = message.guild.members.cache.get(gdb.failUserID);

      if (prevFailUser) {
        prevFailUser.roles.remove(failRole).catch(err => console.error(err));
      }

      // Add the fail role to the user.
      const newFailUser = message.guild.members.cache.get(message.author.id);
      newFailUser.roles.add(failRole).catch(err => console.error(err));

      gdb.set("failUserID", message.author.id);
    }

    // Fetch the message-to-be-pinned by its ID, and then pin it.
    const highestMessage = await message.channel.messages.fetch(
      gdb.highestCountID,
    );

    if (!highestMessage.pinned) {
      highestMessage.pin().catch(err => console.error(err));
    }

    return;
  }

  // Save the timestamp of the latest valid message.
  gdb.set("latestMessage", message.createdTimestamp);

  // Increment the expected count.
  gdb.inc("nextCount");

  // Add the user to the database if they don't already exist.
  if (!gdb.users[message.author.id]) {
    gdb.addUser(message.author);
  }

  // Update the number of correct counts for the user.
  gdb.inc(`users.${message.author.id}.correct`);

  // Award the user with a point!
  gdb.inc(`users.${message.author.id}.points`);

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
  if (gdb.milestones.hasOwnProperty(messageNumber)) {
    const channel: Channel = message.client.channels.cache.get(gdb.channel);

    const text_channel = channel as TextChannel; // This is type safe because the counting channel can never not be a text channel in a guild

    text_channel.setName(gdb.milestones[messageNumber]);

    console.log(
      `Set name of counting channel to ${gdb.milestones[messageNumber]}.`,
    );
  }
}
