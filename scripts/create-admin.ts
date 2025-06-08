import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@madras.com';
  const password = 'admin123'; // You should change this to a secure password

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update the admin user with the hashed password
  const user = await prisma.user.update({
    where: { email },
    data: { password: hashedPassword },
  });

  console.log('Admin user updated successfully:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 