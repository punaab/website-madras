const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const email = 'sean@madras.co.nz';
    const password = 'Madras2024!';
    const name = 'Sean Layton';

    // Hash password with bcryptjs
    const hashedPassword = await hash(password, 12);

    // Create or update admin user
    const admin = await prisma.user.upsert({
      where: { email },
      update: {
        name,
        password: hashedPassword,
        role: 'ADMIN'
      },
      create: {
        email,
        name,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('Admin user created/updated successfully:', admin.email);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 