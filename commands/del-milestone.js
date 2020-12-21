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

    message.client.settings.set(message.guild.id, milestones, "milestones");

    message.channel.send("Milestone deleted!");
  },
};