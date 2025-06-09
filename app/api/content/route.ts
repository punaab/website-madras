import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const content = await prisma.content.findMany({
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Generate a unique section name if not provided
    const section = data.section || `section-${Date.now()}`
    const title = data.title || ''

    // Check if section already exists
    const existingSection = await prisma.content.findUnique({
      where: { section },
    })

    if (existingSection) {
      return NextResponse.json(
        { error: 'Section already exists' },
        { status: 400 }
      )
    }

    // Get the highest order value
    const lastContent = await prisma.content.findFirst({
      orderBy: { order: 'desc' },
    })

    const content = await prisma.content.create({
      data: {
        section,
        title,
        content: data.content || '',
        order: (lastContent?.order || 0) + 1,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()
    
    // Validate required fields
    if (!data.section) {
      return NextResponse.json(
        { error: 'Section is required' },
        { status: 400 }
      )
    }

    const content = await prisma.content.update({
      where: { section: data.section },
      data: {
        title: data.title || '',
        content: data.content || '',
        order: data.order,
        user: {
          connect: {
            id: session.user.id,
          },
        },
      },
    })

    return NextResponse.json(content)
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
} 