import { Collection } from "discord.js";
import * as ping from "./ping";

export const registry = [ping];

export const commands = new Collection(
  registry.map(command => [command.data.name, command]),
);
