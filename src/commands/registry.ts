import { command_t } from "../handlers/commands";

import * as leaderboard from "../commands/leaderboard";
import * as milestone from "../commands/milestone";
import * as ping from "../commands/ping";
import * as serverinfo from "../commands/serverinfo";
import * as setchannel from "../commands/set-channel";
import * as setcount from "../commands/set-count";
import * as setemoji from "../commands/set-emoji";
import * as sethighestcount from "../commands/set-highestcount";
import * as setnomessage from "../commands/set-nomessage";
import * as setnumbersonly from "../commands/set-numbersonly";
import * as setprefix from "../commands/set-prefix";

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
];
