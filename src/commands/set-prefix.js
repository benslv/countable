const { embed } = require("../utils");

module.exports = {
  name: "set-prefix",
  args: true,
  usage: "<prefix>",
  guildOnly: true,
  ownerOnly: true,
  description: "Sets the prefix for commands in the current server.",
};

module.exports.execute = ({ message, args, gdb }) => {
  const prefix = args[0];

  gdb.set("prefix", prefix);

  console.log(gdb.get("prefix"));

  message.channel.send({
    embed: embed(message, {
      type: "success",
      title: "Prefix set!",
      description: `This server's prefix has been set to \`${prefix}\`.`,
    }),
  });
};
