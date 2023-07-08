import { Prisma, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export async function initialiseGuild(id: string) {
  return prisma.guild.create({
    data: {
      guildId: id,
    },
  });
}

export async function ensureGuild(id: string) {
  const guild = await prisma.guild.findUnique({ where: { guildId: id } });

  if (!guild) {
    return initialiseGuild(id);
  }

  return guild;
}

export async function resetCount(id: string) {
  return prisma.guild.update({
    where: { guildId: id },
    data: { count: 0 },
  });
}
