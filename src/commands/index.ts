import { Collection } from "discord.js";

import * as ping from "./ping";
import * as server from "./server";
import * as leaderboard from "./leaderboard";
import * as stats from "./stats";
import * as milestone from "./milestone";

export const registry = [ping, server, leaderboard, stats, milestone];

export const commands = new Collection(
  registry.map(command => [command.metadata.name, command]),
);
