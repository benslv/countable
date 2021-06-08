import { Message } from "discord.js";
import { execute_args, metadata_t } from "../handlers/commands";
import { embed } from "../utils";

export const metadata: metadata_t = {
  name: "set-channel",
  aliases: ["channel"],
  description:
    "Sets the ID of the counting channel to the ID provided by the user.",
  checkArgs: args => args.length === 1,
  guildOnly: true,
  ownerOnly: true,
  usage: "<channel ID>",
};

export async function execute({
  message,
  args,
  gdb,
}: execute_args): Promise<Message> {
  // TODO check that this is a valid channel before accepting
  const guildChannels = message.guild.channels.cache;

  // Match the ID of the channel, whether it's passed in as the raw ID or as a channel mention.
  const match = args[0].match(/(\d{18})/g);

  if (!match) {
    return message.channel.send({
      embed: embed(message, {
        type: "error",
        title: "Invalid input",
        description: "That doesn't look like the right format for a channel ID",
      }),
    });
  }

  const [id] = match;

  // Check that the channel ID exists in the guild.
  if (guildChannels.has(id)) {
    // If so, store the new ID in settings.
    gdb.set("channel", id);

    let channel = await message.client.channels.fetch(id);

    console.log(`Counting channel ID set to ${id}.`);

    return message.channel.send({
      embed: embed(message, {
        type: "success",
        title: "Channel updated!",
        description: `The counting channel has been set to ${channel.toString()}`,
      }),
    });
  }

  return message.channel.send({
    embed: embed(message, {
      type: "error",
      title: "Channel not found.",
      description:
        "I couldn't find that channel in this server. Make sure the ID is correct...",
    }),
  });
}
