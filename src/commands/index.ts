import { Collection } from "discord.js";

import * as ping from "./ping";
import * as server from "./server";

export const registry = [ping, server];

export const commands = new Collection(
  registry.map(command => [command.metadata.name, command]),
);
