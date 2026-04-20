import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import * as libsql from '@libsql/client'

// Wrap createClient to intercept arguments
const originalCreateClient = libsql.createClient;
libsql.createClient = function(config: any) {
    console.log("createClient called with config:", config);
    return originalCreateClient.apply(this, [config]);
};

async function main() {
  console.log("Starting debug...");
  const dbUrl = "file:./dev.db";
  console.log("Initializing libSQL adapter with url:", dbUrl);
  const client = libsql.createClient({ url: dbUrl })
  const adapter = new PrismaLibSql(client)
  const prisma = new PrismaClient({ adapter })
  
  console.log("Attempting query...");
  try {
    const res = await prisma.user.findFirst();
    console.log("Query success: ", res);
  } catch (e: any) {
    console.log("Query failed. Error:", JSON.stringify(e, null, 2));
    console.log("Error properties:", e.code, e.message);
  }
}

main().catch(console.error);
