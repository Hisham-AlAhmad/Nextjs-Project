import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { toPlainText } from '@/lib/richTextUtils'
import { hasPermission } from '@/lib/permissions'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const project = await prisma.project.findUnique({ where: { id: Number(id) } })
    if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(project)
  } catch {
    return Response.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (!hasPermission(session.user, 'projects', 'edit')) return Response.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const body = await request.json()
    const { title, slug, excerpt, description, category, images, details, published } = body

    const project = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title: toPlainText(title) }),
        ...(slug !== undefined && { slug: toPlainText(slug) }),
        ...(excerpt !== undefined && { excerpt: toPlainText(excerpt) }),
        ...(description !== undefined && { description: toPlainText(description) }),
        ...(category !== undefined && { category: toPlainText(category) }),
        ...(images !== undefined && { images }),
        ...(details !== undefined && { details }),
        ...(published !== undefined && { published }),
      },
    })
    return Response.json(project)
  } catch (err) {
    if (err.code === 'P2025') return Response.json({ error: 'Not found' }, { status: 404 })
    if (err.code === 'P2002') return Response.json({ error: 'Slug already exists' }, { status: 409 })
    return Response.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (!hasPermission(session.user, 'projects', 'delete')) return Response.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    await prisma.project.delete({ where: { id: Number(id) } })
    return Response.json({ success: true })
  } catch (err) {
    if (err.code === 'P2025') return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ error: 'Failed to delete project' }, { status: 500 })
  }
}
