// Import Prisma Client
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma Client
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydatabase',
        },
    },
});

// Export the Prisma Client instance
module.exports = prisma;
