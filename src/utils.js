module.exports.isNumber = n => /^\d+$/.test(n); // Regex testing for a string being a number (more specifically, consisting only of digits).

module.exports.embed = (
  message,
  { type = "info", title = "", description = "", ...rest },
  verbose = false,
) => {
  const types = {
    info: 0xffa630,
    error: 0xe84855,
    success: 0x4aeb47,
  };

  let output = {
    color: types[type],
    title: title,
    description: description,
    ...rest,
  };

  if (verbose) {
    output = {
      ...output,
      footer: {
        text: `Requested by ${message.author.tag}`,
        icon_url: message.author.avatarURL(),
      },
      timestamp: new Date(),
    };
  }

  return output;
};

module.exports.getUserScore = user => user.correct - user.incorrect;
