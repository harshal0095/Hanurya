import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.BOOTSTRAP_ADMIN_PASSWORD;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Set a valid BOOTSTRAP_ADMIN_EMAIL before provisioning an admin.');
  }
  if (!password || password.length < 16 || Buffer.byteLength(password, 'utf8') > 72) {
    throw new Error('Set a unique BOOTSTRAP_ADMIN_PASSWORD between 16 and 72 bytes.');
  }
  if (await prisma.user.findFirst({ where: { role: 'ADMIN' } })) {
    throw new Error('An admin already exists. This bootstrap script never resets admin credentials.');
  }
  if (await prisma.user.findFirst({ where: { email: { equals: email, mode: 'insensitive' } } })) {
    throw new Error('The bootstrap email already belongs to another account.');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.user.create({
    data: {
      name: 'Store Administrator',
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`Admin account created for ${admin.email}. Remove the bootstrap credentials from the environment now.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
