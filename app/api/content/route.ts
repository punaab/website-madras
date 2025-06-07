import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const contents = await prisma.content.findMany({
      orderBy: {
        order: 'asc'
      }
    })

    return new NextResponse(JSON.stringify(contents), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return new NextResponse(JSON.stringify({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    // Get the highest current order
    const highestOrder = await prisma.content.findFirst({
      orderBy: {
        order: 'desc'
      },
      select: {
        order: true
      }
    })

    const content = await prisma.content.create({
      data: {
        title: data.title,
        content: data.content,
        section: data.section || 'general',
        userId: session.user.id,
        order: (highestOrder?.order ?? -1) + 1 // Set order to be one more than the highest
      },
    })
    return NextResponse.json(content)
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json({ 
      error: 'Error creating content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const contents = await request.json()

    // Validate the request body
    if (!Array.isArray(contents)) {
      return new NextResponse(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Use a transaction to ensure all updates succeed or fail together
    const updatedContents = await prisma.$transaction(
      contents.map(content => 
        prisma.content.upsert({
          where: { id: content.id },
          update: {
            title: content.title,
            content: content.content,
            section: content.section,
            user: { connect: { id: session.user.id } },
            order: content.order
          },
          create: {
            title: content.title,
            content: content.content,
            section: content.section || 'general',
            user: { connect: { id: session.user.id } },
            order: content.order
          }
        })
      )
    )

    // Sort the results by order before returning
    const sortedContents = updatedContents.sort((a, b) => 
      (a.order || 0) - (b.order || 0)
    )

    return new NextResponse(JSON.stringify(sortedContents), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error updating content:', error)
    return new NextResponse(JSON.stringify({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 