import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

// Force the environment variable for Prisma's internal WASM engine
if (typeof process !== 'undefined' && process.env) {
  process.env.DATABASE_URL = "file:./dev.db";
}

const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL || "file:./dev.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;
  console.log("Initializing libSQL connection...");
  const adapter = new PrismaLibSql({ 
    url: dbUrl,
    authToken: authToken
  });
  return new PrismaClient({ adapter })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined
}

const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
