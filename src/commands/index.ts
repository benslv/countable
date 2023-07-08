import { Collection } from "discord.js";

// import * as save from "./save";
// import * as leaderboard from "./leaderboard";
// import * as milestone from "./milestone";
import * as ping from "./ping";
// import * as server from "./server";
import * as set from "./set";
// import * as stats from "./stats";

export const registry = [
  // save,
  set,
  ping,
  // milestone,
  // leaderboard,
  // server,
  // stats,
];

export const commands = new Collection(
  registry.map(command => [command.data.name, command]),
);
