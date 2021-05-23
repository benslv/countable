const { embed } = require("../utils");

module.exports = {
  name: "stats",
  description: "Replies to the user to confirm the bot is running correctly!",
  args: false,
  guildOnly: true,
  ownerOnly: false,
  usage: "<blank> or <user mention>",
  execute({ message, gdb }) {
    const mentions = message.mentions.users;

    let response;

    if (mentions.size === 0) {
      response = getUserStats({ gdb, message, id: message.member.id });
    } else {
      const id = mentions.first().id;
      const userInfo = gdb.users[id];

      if (userInfo) {
        response = getUserStats({ gdb, message, id });
      } else {
        response = {
          type: "error",
          title: "User not found.",
          description:
            "Sorry, I couldn't find that user.\n\nMake sure you mentioned the correct person.\nPerhaps they haven't done any counting yet?",
        };
      }
    }

    return message.channel.send({ embed: embed(message, response) });
  },
};

const getUserStats = ({ gdb, message, id }) => {
  const correct = gdb.users[id].correct;
  const incorrect = gdb.users[id].incorrect;

  return {
    type: "info",
    title: `Stats for ${message.author.tag}`,
    description: "Here are your stats for this server!",
    thumbnail: {
      url: message.author.avatarURL(),
    },
    fields: [
      {
        name: "Total Counts",
        value: correct + incorrect,
        inline: true,
      },
      {
        name: "Correct",
        value: correct,
        inline: true,
      },
      {
        name: "Incorrect",
        value: incorrect,
        inline: true,
      },
      {
        name: "Score",
        value: correct - incorrect,
        inline: true,
      },
      {
        name: "Accuracy",
        value: correct / (correct + incorrect),
        inline: true,
      },
    ],
  };
};
