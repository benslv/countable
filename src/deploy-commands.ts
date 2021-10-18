import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { CLIENT_ID, CLIENT_TOKEN } from "../config.json";

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
].map(command => command.toJSON());

const rest = new REST({ version: "9" }).setToken(CLIENT_TOKEN);

rest
  .put(Routes.applicationGuildCommands(CLIENT_ID, "846052177184423946"), {
    body: commands,
  })
  .then(() => console.log("Successfully registered commands!"))
  .catch(console.error);
