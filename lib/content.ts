import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getContent() {
  try {
    const content = await prisma.content.findMany({
      orderBy: {
        order: 'asc',
      },
    })
    return content
  } catch (error) {
    console.error('Error fetching content:', error)
    return []
  }
} 