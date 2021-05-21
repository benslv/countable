module.exports.isNumber = n => /^\d+$/.test(n); // Regex testing for a string being a number (more specifically, consisting only of digits).

module.exports.embed = (
  message,
  { type = "info", title = "", description = "", ...rest },
) => {
  const types = {
    info: 0xffa630,
    error: 0xe84855,
    success: 0x4aeb47,
  };

  return {
    color: types[type],
    title: title,
    description: description,
    footer: {
      text: `Requested by ${message.author.tag}`,
      icon_url: message.author.avatarURL(),
    },
    timestamp: new Date(),
    ...rest,
  };
};
