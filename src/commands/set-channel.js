const { embed } = require("../utils");

module.exports = {
  name: "set-channel",
  aliases: ["channel"],
  description:
    "Sets the ID of the counting channel to the ID provided by the user.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<channel ID>",
  execute({ message, args, gdb }) {
    const guildChannels = message.guild.channels.cache;

    // Match the ID of the channel, whether it's passed in as the raw ID or as a channel mention.
    const match = args[0].match(/(\d{18})/g);

    if (!match) {
      return message.channel.send({
        embed: embed(message, {
          type: "error",
          title: "Invalid input",
          description:
            "That doesn't look like the right format for a channel ID",
        }),
      });
    }

    const [id] = match;

    // Check that the channel ID exists in the guild.
    if (guildChannels.has(id)) {
      // If so, store the new ID in settings.
      gdb.set("channel", id);

      return message.client.channels
        .fetch(id)
        .then(channel => {
          message.channel.send({
            embed: embed(message, {
              type: "success",
              title: "Channel updated!",
              description: `The counting channel has been set to ${channel.toString()}`,
            }),
          });

          console.log(`Counting channel ID set to ${id}.`);
        })
        .catch(err => console.error(err));
    }

    return message.channel.send({
      embed: embed(message, {
        type: "error",
        title: "Channel not found.",
        description:
          "I couldn't find that channel in this server. Make sure the ID is correct...",
      }),
    });
  },
};
