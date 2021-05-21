const utils = require("../utils");

module.exports = {
  name: "milestone",
  description: "Commands related to adding/removing/listing milestones.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<action> <value/s>",
  execute({ message, args, gdb }) {
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
        gdb: gdb,
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

function listMilestones({ message, gdb }) {
  const milestones = gdb.get("milestones");

  const milestoneFields = [];

  for (let key in milestones) {
    milestoneFields.push({ name: key, value: milestones[key], inline: true });
  }

  const embed = utils.embed(message, {
    type: "info",
    title: "Server Milestones",
    description: "Here are the milestones you have set up in your server!",
    thumbnail: { url: message.guild.iconURL() },
    fields: milestoneFields,
  });

  console.log("Listing milestones:\n", gdb.get("milestones"));

  return { embed };
}

function addMilestone({ count, name, gdb }) {
  if (count < 0 || !utils.isNumber(count)) {
    return "Milestones can only be added at positive integers :grimacing:";
  }

  if (!name) {
    return "Please provide a name for the milestone.";
  }

  gdb.set(`milestones.${count}`, name);

  console.log(
    `Added title milestone of ${name} at count ${count}.\n`,
    gdb.get("milestones"),
  );

  return `Milestone of **#${name}** was added at count \`${count}\`!`;
}

function removeMilestone({ count, gdb }) {
  if (count < 0 || !utils.isNumber(count)) {
    return "Milestones can only be removed from positive integers :grimacing:";
  }

  const milestones = gdb.get("milestones");

  delete milestones[count];

  console.log(
    `Delete title milestone from count ${count}.\n`,
    gdb.get("milestones"),
  );

  return `Any milestones have been deleted from count \`${count}\`!`;
}
