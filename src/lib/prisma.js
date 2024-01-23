import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma;
let config = { log: ["query", "info"] };

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient(config);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(config);
  }
  prisma = global.prisma;
}

export default prisma;
