import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { hash } from 'bcryptjs'

export async function GET() {
  try {
    console.log('GET /api/admin/users - Starting request')
    const session = await getServerSession(authOptions)
    console.log('Session in GET /api/admin/users:', JSON.stringify(session, null, 2))

    if (!session?.user) {
      console.log('No session found')
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 })
    }

    // Get the full user from the database to check role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    })

    console.log('Found user:', JSON.stringify(user, null, 2))

    if (!user || user.role !== 'ADMIN') {
      console.log('User not found or not admin:', { user, sessionUser: session.user })
      return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    console.log('Found users:', JSON.stringify(users, null, 2))
    return NextResponse.json(users)
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/admin/users - Starting request')
    const session = await getServerSession(authOptions)
    console.log('Session in POST /api/admin/users:', JSON.stringify(session, null, 2))

    if (!session?.user) {
      console.log('No session found')
      return NextResponse.json({ error: 'Unauthorized - No session' }, { status: 401 })
    }

    // Get the full user from the database to check role
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { role: true }
    })

    console.log('Found user:', JSON.stringify(user, null, 2))

    if (!user || user.role !== 'ADMIN') {
      console.log('User not found or not admin:', { user, sessionUser: session.user })
      return NextResponse.json({ error: 'Unauthorized - Not admin' }, { status: 401 })
    }

    const data = await request.json()
    console.log('Received user data:', { ...data, password: '[REDACTED]' })
    
    // Validate required fields
    if (!data.email || !data.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Validate role
    if (data.role && !['USER', 'ADMIN'].includes(data.role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be either USER or ADMIN' },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await hash(data.password, 12)

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    const newUser = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name || null,
        password: hashedPassword,
        role: data.role || 'USER',
        isSuperUser: data.isSuperUser || false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isSuperUser: true,
      },
    })

    console.log('Created user:', newUser)
    return NextResponse.json(newUser)
  } catch (error) {
    console.error('Error in POST /api/admin/users:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 