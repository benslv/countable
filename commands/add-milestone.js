module.exports = {
  name: "add-milestone",
  description:
    "Adds a milestone (tracked by the bot) to change channel name once a certain count is reached.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<count> <channel name>",
  execute(message, args) {
    const count = args[0];
    const name = args[1];

    message.client.settings.set(message.guild.id, name, `milestones.${count}`);

    console.log(
      `Added title milestone of ${name} at count ${count}.\n`,
      message.client.settings.get(message.guild.id, "milestones"),
    );

    message.channel.send(
      `Milestone of **#${name}** was added at count \`${count}\`!`,
    );
  },
};
