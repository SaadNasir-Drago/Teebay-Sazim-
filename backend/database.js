// Import Prisma Client
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || 'postgresql://postgres:root@localhost:5432/postgres',
        },
    },
});

// Export the Prisma Client instance
module.exports = prisma;
