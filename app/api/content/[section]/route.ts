import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ContentUpdateInput } from '@prisma/client'

export async function PUT(
  request: Request,
  { params }: { params: { section: string } }
) {
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

    const data = await request.json()
    const { section } = params

    // Validate required fields
    if (typeof data.content !== 'string') {
      return new NextResponse(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const updatedContent = await prisma.content.update({
      where: { section },
      data: {
        content: data.content,
        title: data.title,
        order: typeof data.order === 'string' ? parseInt(data.order, 10) : (typeof data.order === 'number' ? data.order : 0),
        user: { connect: { id: session.user.id } }
      }
    })

    return new NextResponse(JSON.stringify(updatedContent), {
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

export async function DELETE(
  request: Request,
  { params }: { params: { section: string } }
) {
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

    const { section } = params

    // First check if the section exists
    const existingContent = await prisma.content.findUnique({
      where: { section }
    })

    if (!existingContent) {
      return new NextResponse(JSON.stringify({ error: 'Section not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Delete the section
    await prisma.content.delete({
      where: { section }
    })

    // Return success response
    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error deleting content:', error)
    return new NextResponse(JSON.stringify({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 