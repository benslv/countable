import { command_t } from "../handlers/commands";

import * as leaderboard from "./leaderboard";
import * as milestone from "./milestone";
import * as ping from "./ping";
import * as serverIno from "./serverinfo";
import * as setChannel from "./set-channel";
import * as setCount from "./set-count";
import * as setEmoji from "./set-emoji";
import * as setHighestCount from "./set-highestcount";
import * as setNoMessage from "./set-nomessage";
import * as setNumbersOnly from "./set-numbersonly";
import * as setPrefix from "./set-prefix";
import * as stats from "./stats";
import * as addSave from "./add-save";

export const commands: command_t[] = [
  {
    metadata: leaderboard.metadata,
    execute: leaderboard.execute,
  },
  {
    metadata: milestone.metadata,
    execute: milestone.execute,
  },
  {
    metadata: ping.metadata,
    execute: ping.execute,
  },
  {
    metadata: serverIno.metadata,
    execute: serverIno.execute,
  },
  {
    metadata: setChannel.metadata,
    execute: setChannel.execute,
  },
  {
    metadata: setCount.metadata,
    execute: setCount.execute,
  },
  {
    metadata: setEmoji.metadata,
    execute: setEmoji.execute,
  },
  {
    metadata: setHighestCount.metadata,
    execute: setHighestCount.execute,
  },
  {
    metadata: setNoMessage.metadata,
    execute: setNoMessage.execute,
  },
  {
    metadata: setNumbersOnly.metadata,
    execute: setNumbersOnly.execute,
  },
  {
    metadata: setPrefix.metadata,
    execute: setPrefix.execute,
  },
  {
    metadata: stats.metadata,
    execute: stats.execute,
  },
  {
    metadata: addSave.metadata,
    execute: addSave.execute,
  },
];
