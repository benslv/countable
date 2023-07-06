import { Collection } from "discord.js";

import * as leaderboard from "./leaderboard";
import * as milestone from "./milestone";
import * as ping from "./ping";
import * as serverinfo from "./serverinfo";
import * as stats from "./stats";

export const registry = [ping, milestone, leaderboard, serverinfo, stats];

export const commands = new Collection(
  registry.map(command => [command.data.name, command]),
);
