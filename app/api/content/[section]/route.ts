import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: { section: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await request.json();
    const { section } = params;

    // Validate required fields
    if (typeof data.content !== 'string') {
      return new NextResponse(JSON.stringify({ error: 'Content is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const updatedContent = await prisma.content.upsert({
      where: { section },
      update: {
        content: data.content,
        title: data.title,
        ...(typeof data.order === 'number' && { order: data.order }),
        ...(typeof data.order === 'string' && !isNaN(parseInt(data.order, 10)) && { order: parseInt(data.order, 10) }),
        user: { connect: { id: session.user.id } }
      },
      create: {
        section: section,
        content: data.content,
        title: data.title || '',
        order: typeof data.order === 'number' ? data.order : 
               typeof data.order === 'string' && !isNaN(parseInt(data.order, 10)) ? parseInt(data.order, 10) : 0,
        user: { connect: { id: session.user.id } }
      }
    });

    return new NextResponse(JSON.stringify(updatedContent), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { section: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (session.user.role !== 'ADMIN') {
      return new NextResponse(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { section } = params;

    const existingContent = await prisma.content.findUnique({
      where: { section },
    });

    if (!existingContent) {
      return new NextResponse(JSON.stringify({ error: 'Section not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await prisma.content.delete({
      where: { section },
    });

    return new NextResponse(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return new NextResponse(
      JSON.stringify({
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}