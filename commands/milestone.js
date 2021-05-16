const utils = require("../utils");

module.exports = {
  name: "milestone",
  description: "Commands related to adding/removing/listing milestones.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<action> <value/s>",
  execute(message, args) {
    const action = args[0];
    const values = args.slice(1);

    const actions = {
      list: listMilestones,
      add: addMilestone,
      remove: removeMilestone,
    };

    try {
      const response = actions[action]({
        message: message,
        count: values[0],
        name: values[1],
      });

      if (response) {
        return message.channel.send(response);
      }
    } catch (err) {
      console.error(err);

      return message.channel.send(
        "Sorry! That isn't a valid action for this command... :sob:",
      );
    }
  },
};

function listMilestones({ message }) {
  const milestones = message.client.settings.get(
    message.guild.id,
    "milestones",
  );

  const milestoneFields = [];

  for (let key in milestones) {
    milestoneFields.push({ name: key, value: milestones[key] });
  }

  const embed = {
    color: 0xffa630,
    title: "Server Milestones",
    description: "Here are the milestones you have set up in your server!",
    fields: milestoneFields,
  };

  console.log(
    "Listing milestones:\n",
    message.client.settings.get(message.guild.id, "milestones"),
  );

  return { embed };
}

function addMilestone({ message, count, name }) {
  if (count < 0 || !utils.isNumber(count)) {
    return "Milestones can only be added at positive integers :grimacing:";
  }

  if (!name) {
    return "Please provide a name for the milestone.";
  }

  message.client.settings.set(message.guild.id, name, `milestones.${count}`);

  console.log(
    `Added title milestone of ${name} at count ${count}.\n`,
    message.client.settings.get(message.guild.id, "milestones"),
  );

  return `Milestone of **#${name}** was added at count \`${count}\`!`;
}

function removeMilestone({ message, count }) {
  if (count < 0 || !utils.isNumber(count)) {
    return "Milestones can only be removed from positive integers :grimacing:";
  }

  const milestones = message.client.settings.get(
    message.guild.id,
    "milestones",
  );

  delete milestones[count];

  console.log(
    `Delete title milestone from count ${count}.\n`,
    message.client.settings.get(message.guild.id, "milestones"),
  );

  return `Any milestones have been deleted from count \`${count}\`!`;
}
