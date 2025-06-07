const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  try {
    // First, remove Link Layton's account
    await prisma.user.deleteMany({
      where: {
        email: 'linklayton@example.com'
      }
    })
    console.log('Removed Link Layton account')

    // Update Sean Layton to be superuser
    const sean = await prisma.user.update({
      where: {
        email: 'music.seanlayton@gmail.com'
      },
      data: {
        isSuperUser: true
      }
    })
    console.log('Updated Sean Layton to superuser:', sean)

    // Remove superuser status from any other users
    await prisma.user.updateMany({
      where: {
        email: {
          not: 'music.seanlayton@gmail.com'
        }
      },
      data: {
        isSuperUser: false
      }
    })
    console.log('Removed superuser status from other users')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main() 