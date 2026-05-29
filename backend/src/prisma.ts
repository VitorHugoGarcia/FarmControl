import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client"; // <- GARANTA QUE ESTÁ EXATAMENTE ASSIM (Sem o "/extension" no final)


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma = new PrismaClient({ adapter });