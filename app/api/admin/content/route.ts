import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contents = await prisma.content.findMany({
      orderBy: {
        section: 'asc'
      }
    })

    return NextResponse.json(contents)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    console.log('Session:', session) // Debug log

    if (!session?.user) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 })
    }

    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Not authorized as admin' }, { status: 401 })
    }

    const contents = await request.json()
    if (!Array.isArray(contents)) {
      return NextResponse.json(
        { error: 'Invalid request body', details: 'Expected an array of content items' },
        { status: 400 }
      )
    }

    const updatedContents = await Promise.all(
      contents.map(async (content) => {
        if (!content.section) {
          throw new Error('Missing required field: section')
        }

        // First, try to find existing content
        const existingContent = await prisma.content.findUnique({
          where: { section: content.section }
        })

        if (existingContent) {
          // Update existing content
          return prisma.content.update({
            where: { section: content.section },
            data: {
              title: content.title || '',
              content: content.content || ''
            }
          })
        } else {
          // Get the admin user
          const adminUser = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
          })

          if (!adminUser) {
            throw new Error('No admin user found')
          }

          // Create new content
          return prisma.content.create({
            data: {
              section: content.section,
              title: content.title || '',
              content: content.content || '',
              userId: adminUser.id
            }
          })
        }
      })
    )

    return NextResponse.json(updatedContents)
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Failed to update content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 