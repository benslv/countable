module.exports = {
  name: "leaderboard",
  description: "Displays the leaderboard for the current guild.",
  args: false,
  guildOnly: true,
  ownerOnly: false,
  usage: "",
  execute({ message, args, gdb }) {
    // Get all users stored in gdb
    // Calculate score (correct - incorrect) and accuracy for each
    // Sort by score, then tiebreak on accuracy
  },
};
