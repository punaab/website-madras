import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create admin user with password
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@madras.com' },
    update: {
      password: adminPassword,
      role: Role.ADMIN,
      isSuperUser: true,
    },
    create: {
      email: 'admin@madras.com',
      name: 'Admin User',
      password: adminPassword,
      role: Role.ADMIN,
      isSuperUser: true,
    },
  })

  console.log('Admin user created:', admin.email)

  // Create initial content sections
  const sections = [
    { section: 'hero', title: 'Hero Section', content: 'Welcome to Madras' },
    { section: 'about', title: 'About Us', content: 'About Madras' },
    { section: 'contact', title: 'Contact Us', content: 'Get in touch with us' },
  ]

  for (const section of sections) {
    await prisma.content.upsert({
      where: { section: section.section },
      update: section,
      create: {
        ...section,
        userId: admin.id,
      },
    })
  }

  console.log('Initial content sections created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 