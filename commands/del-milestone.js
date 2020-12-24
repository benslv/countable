module.exports = {
  name: "del-milestone",
  description: "Deletes a milestone from the list of tracked milestones.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<count>",
  execute(message, args) {
    const count = args[0];

    const milestones = message.client.settings.get(
      message.guild.id,
      "milestones",
    );

    delete milestones[count];

    console.log(
      `Delete title milestone from count ${count}.\n${message.client.settings.get(
        message.guild.id,
        "milestones",
      )}`,
    );

    message.channel.send(`Milestone was deleted from count \`${count}\`!`);
  },
};
