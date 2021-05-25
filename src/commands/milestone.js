const { isNumber, embed } = require("../utils");

module.exports = {
  name: "milestone",
  description: "Commands related to adding/removing/listing milestones.",
  args: true,
  guildOnly: true,
  ownerOnly: true,
  usage: "<action> <value/s>",
};

module.exports.execute = ({ message, args, gdb }) => {
  const action = args[0];
  const values = args.slice(1);

  const actions = {
    list: listMilestones,
    add: addMilestone,
    remove: removeMilestone,
  };

  if (action in actions) {
    const response = actions[action]({
      message: message,
      count: values[0],
      name: values[1],
      gdb: gdb,
    });

    return message.channel.send({ embed: embed(message, { ...response }) });
  }

  return message.channel.send({
    embed: embed(message, {
      type: "error",
      title: "Invalid action.",
      description:
        "Sorry! That isn't a valid action for this command.\nValid actions are: `list`, `add`, `remove`",
    }),
  });
};

function listMilestones({ message, gdb }) {
  const milestones = gdb.get("milestones");

  console.log("Listing milestones:\n", milestones);

  const milestoneFields = [];

  for (let key in milestones) {
    milestoneFields.push({ name: key, value: milestones[key], inline: true });
  }

  return {
    type: "info",
    title: "Server Milestones",
    description: "Here are the milestones you have set up in your server!",
    thumbnail: { url: message.guild.iconURL() },
    fields: milestoneFields,
  };
}

function addMilestone({ count, name, gdb }) {
  if (count < 0 || !isNumber(count)) {
    return {
      type: "error",
      title: "Invalid number.",
      description:
        "Milestones can only be added at positive integers :grimacing:",
    };
  }

  if (!name) {
    return {
      type: "error",
      title: "No name provided.",
      description: "Please provide a name for the milestone.",
    };
  }

  gdb.set(`milestones.${count}`, name);

  console.log(
    `Added title milestone of ${name} at count ${count}.\n`,
    gdb.get("milestones"),
  );

  return {
    type: "success",
    title: "Milestone added!",
    description: `Milestone of **#${name}** was added at count \`${count}\`!`,
  };
}

function removeMilestone({ count, gdb }) {
  if (count < 0 || !isNumber(count)) {
    return {
      type: "error",
      title: "Invalid number.",
      description:
        "Milestones can only be removed from positive integers :grimacing:",
    };
  }

  const milestones = gdb.get("milestones");

  delete milestones[count];

  console.log(
    `Delete title milestone from count ${count}.\n`,
    gdb.get("milestones"),
  );

  return {
    type: "success",
    title: "Milestone added!",
    description: `Any milestones have been deleted from count \`${count}\`!`,
  };
}
