import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const email = 'music.seanlayton@gmail.com'
  const password = await hash('TBTuR1N1QT$ZL*XJ', 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: 'Sean Layton',
      password,
      role: 'ADMIN',
      isSuperUser: true,
    },
  })

  console.log('Super user created:', user)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 