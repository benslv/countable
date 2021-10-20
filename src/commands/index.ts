import { Collection } from "discord.js";

import * as ping from "./ping";

export const commands = new Collection([[ping.metadata.name, ping]]);
