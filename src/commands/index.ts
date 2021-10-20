import { Collection } from "discord.js";

import * as ping from "./ping";

const registry = [ping];

export const commands = new Collection(
  registry.map(command => [command.metadata.name, command]),
);
