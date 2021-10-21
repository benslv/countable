import { Collection } from "discord.js";

import * as ping from "./ping";
import * as server from "./server";
import * as leaderboard from "./leaderboard";

export const registry = [ping, server, leaderboard];

export const commands = new Collection(
  registry.map(command => [command.metadata.name, command]),
);
