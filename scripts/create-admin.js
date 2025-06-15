const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Override the DATABASE_URL with DATABASE_PUBLIC_URL
process.env.DATABASE_URL = process.env.DATABASE_PUBLIC_URL;

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'sean@madras.co.nz'
      }
    });

    if (existingAdmin) {
      console.log('Admin user already exists, updating password...');
      const hashedPassword = await bcrypt.hash('Madras2024!', 10);
      await prisma.user.update({
        where: {
          email: 'sean@madras.co.nz'
        },
        data: {
          password: hashedPassword,
          role: 'ADMIN',
          isSuperUser: true
        }
      });
      console.log('Admin user updated successfully');
    } else {
      console.log('Creating new admin user...');
      const hashedPassword = await bcrypt.hash('Madras2024!', 10);
      await prisma.user.create({
        data: {
          email: 'sean@madras.co.nz',
          name: 'Sean Layton',
          password: hashedPassword,
          role: 'ADMIN',
          isSuperUser: true
        }
      });
      console.log('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 