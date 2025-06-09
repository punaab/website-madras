const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Create Prisma client with explicit database URL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/madras'
    }
  }
})

async function main() {
  try {
    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.user.upsert({
      where: { email: 'admin@madras.com' },
      update: {},
      create: {
        email: 'admin@madras.com',
        name: 'Admin',
        password: hashedPassword,
      },
    })

    console.log('Admin user created:', admin)
  } catch (error) {
    console.error('Error creating admin user:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 