import "dotenv/config";

import { REST, Routes } from "discord.js";

import { registry } from "./commands";

const rest = new REST().setToken(process.env.CLIENT_TOKEN);

const commands = registry.map(command => command.data.toJSON());

rest
  .put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.GUILD_ID,
    ),
    { body: commands },
  )
  .then(() =>
    console.log(`Successfully registered ${commands.length} commands!`),
  )
  .catch(err =>
    console.error("There was an error while registering the commands.", err),
  );
