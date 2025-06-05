import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const content = await prisma.content.findMany({
      orderBy: {
        order: 'asc',
      },
    })
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching content' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const content = await prisma.content.create({
      data: {
        ...data,
        userId: session.user?.id,
      },
    })
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Error creating content' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const content = await prisma.content.update({
      where: { id: data.id },
      data: {
        ...data,
        userId: session.user?.id,
      },
    })
    return NextResponse.json(content)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating content' }, { status: 500 })
  }
} 