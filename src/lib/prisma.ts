import { PrismaClient } from "@prisma/client";

// Singleton do Prisma Client.
// Em desenvolvimento o Next.js recarrega os módulos a cada alteração, o que
// criaria várias conexões. Guardamos a instância no globalThis para reaproveitar.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
