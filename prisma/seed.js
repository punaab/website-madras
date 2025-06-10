const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('Madras2024!', 12)

  const admin = await prisma.user.upsert({
    where: { email: 'sean@madras.co.nz' },
    update: {},
    create: {
      email: 'sean@madras.co.nz',
      name: 'Sean Layton',
      role: 'ADMIN',
      password: hashedPassword
    },
  })

  console.log('Created admin user:', admin)
}

main()
  .catch((e) => {
    console.error('Error creating admin user:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 