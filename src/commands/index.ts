import { command_t } from "../handlers/commands";

import * as leaderboard from "./leaderboard";
import * as milestone from "./milestone";
import * as ping from "./ping";
import * as serverinfo from "./serverinfo";
import * as setchannel from "./set-channel";
import * as setcount from "./set-count";
import * as setemoji from "./set-emoji";
import * as sethighestcount from "./set-highestcount";
import * as setnomessage from "./set-nomessage";
import * as setnumbersonly from "./set-numbersonly";
import * as setprefix from "./set-prefix";
import * as stats from "./stats";

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
    metadata: serverinfo.metadata,
    execute: serverinfo.execute,
  },
  {
    metadata: setchannel.metadata,
    execute: setchannel.execute,
  },
  {
    metadata: setcount.metadata,
    execute: setcount.execute,
  },
  {
    metadata: setemoji.metadata,
    execute: setemoji.execute,
  },
  {
    metadata: sethighestcount.metadata,
    execute: sethighestcount.execute,
  },
  {
    metadata: setnomessage.metadata,
    execute: setnomessage.execute,
  },
  {
    metadata: setnumbersonly.metadata,
    execute: setnumbersonly.execute,
  },
  {
    metadata: setprefix.metadata,
    execute: setprefix.execute,
  },
  {
    metadata: stats.metadata,
    execute: stats.execute,
  },
];
