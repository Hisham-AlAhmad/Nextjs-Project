import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { toPlainText } from '@/lib/richTextUtils'

export async function GET(request, { params }) {
  try {
    const { id } = await params
    const post = await prisma.newsPost.findUnique({
      where: { id: Number(id) },
      include: { author: { select: { name: true } } },
    })
    if (!post) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(post)
  } catch {
    return Response.json({ error: 'Failed to fetch news post' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const { title, slug, excerpt, content, published } = body

    const post = await prisma.newsPost.update({
      where: { id: Number(id) },
      data: {
        ...(title !== undefined && { title: toPlainText(title) }),
        ...(slug !== undefined && { slug: toPlainText(slug) }),
        ...(excerpt !== undefined && { excerpt: toPlainText(excerpt) }),
        ...(content !== undefined && { content: toPlainText(content) }),
        ...(published !== undefined && { published }),
      },
    })
    return Response.json(post)
  } catch (err) {
    if (err.code === 'P2025') return Response.json({ error: 'Not found' }, { status: 404 })
    if (err.code === 'P2002') return Response.json({ error: 'Slug already exists' }, { status: 409 })
    return Response.json({ error: 'Failed to update news post' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await prisma.newsPost.delete({ where: { id: Number(id) } })
    return Response.json({ success: true })
  } catch (err) {
    if (err.code === 'P2025') return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ error: 'Failed to delete news post' }, { status: 500 })
  }
}
