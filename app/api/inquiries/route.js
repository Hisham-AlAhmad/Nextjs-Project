import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    const inquiries = await prisma.projectInquiry.findMany({
      where: projectId ? { projectId: Number(projectId) } : {},
      orderBy: { createdAt: 'desc' },
      include: { project: { select: { title: true, slug: true } } },
    })
    return Response.json(inquiries)
  } catch {
    return Response.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, message, projectId } = body

    if (!name || !email || !message || !projectId) {
      return Response.json({ error: 'All fields are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const inquiry = await prisma.projectInquiry.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        message: String(message).trim(),
        projectId: Number(projectId),
      },
    })
    return Response.json({ success: true, id: inquiry.id }, { status: 201 })
  } catch (err) {
    if (err.code === 'P2003') return Response.json({ error: 'Project not found' }, { status: 404 })
    return Response.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }
}
