const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 12);

  const user = await prisma.user.upsert({
    where: { email: 'admin@agentflow.com' },
    update: {
      name: 'AgentFlow Admin',
      passwordHash,
      role: 'ADMIN',
    },
    create: {
      name: 'AgentFlow Admin',
      email: 'admin@agentflow.com',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`Seeded admin user: ${user.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
