import 'server-only';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getDb(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;

  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) throw new Error('DATABASE_URL is required for database access.');

  const adapter = new PrismaPg({ connectionString, max: 3, connectionTimeoutMillis: 10000 });
  const client = new PrismaClient({ adapter });
  
  globalForPrisma.prisma = client;

  return client;
}
