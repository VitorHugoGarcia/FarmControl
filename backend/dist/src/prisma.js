"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const adapter_pg_1 = require("@prisma/adapter-pg");
const extension_1 = require("@prisma/client/extension");
const adapter = new adapter_pg_1.PrismaPg({ connectionString: process.env.DATABASE_URL });
exports.prisma = new extension_1.PrismaClient({ adapter });
//# sourceMappingURL=prisma.js.map