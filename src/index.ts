import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import "dotenv/config";
import { ensureGuild, prisma, resetCount } from "./db";
import { isDigits } from "./utils";
import { interactionHandler } from "./handlers/interaction";

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on(Events.ClientReady, () => {
  console.log("Countable is up and ready!");

  client.user.setPresence({
    status: "online",
    activities: [
      {
        type: ActivityType.Watching,
        name: "you count!",
      },
    ],
  });
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { channelId } = await prisma.guild.findUnique({
    where: { guildId: interaction.guildId },
    select: {
      channelId: true,
    },
  });

  // Ignore interactions in the counting channel.
  if (interaction.channelId === channelId) return;

  interactionHandler(interaction);
});

client.on(Events.MessageCreate, async message => {
  if (message.author.bot) return;

  if (message.channelId !== "846052307304448011") return;

  const messageSplit = message.content.split(/\s/);

  // Ensure message starts with a number.
  if (!isDigits(messageSplit[0])) {
    message
      .delete()
      .catch(err =>
        console.error(`Error while deleting message ${message.id}...\n${err}`),
      );

    return;
  }

  const guildInfo = await ensureGuild(message.guildId);

  // if (message.author.id === guildInfo.latestMessageId) {
  //   message
  //     .delete()
  //     .catch(err =>
  //       console.error(`Error while deleting message ${message.id}...\n${err}`),
  //     );

  //   return;
  // }

  // Store latest author ID.
  await prisma.guild.update({
    where: {
      guildId: message.guildId,
    },
    data: {
      latestMessageId: message.author.id,
    },
  });

  const count = parseInt(messageSplit[0], 10);

  if (count !== guildInfo.count + 1) {
    message.channel.send(
      `:boom: **Wrong number, ${message.author.toString()}!**`,
    );

    await resetCount(message.guildId);

    return;
  }

  // Increment count
  await prisma.guild.update({
    where: { guildId: message.guildId },
    data: { count },
  });
});

client.login(process.env.CLIENT_TOKEN);
