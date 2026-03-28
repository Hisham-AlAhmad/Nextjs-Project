import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const posts = await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
    })
    return Response.json(posts)
  } catch {
    return Response.json({ error: 'Failed to fetch news' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, slug, excerpt, content, published } = body

    if (!title || !slug || !excerpt || !content) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const post = await prisma.newsPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        published: published ?? false,
        authorId: session.user.id,
      },
    })
    return Response.json(post, { status: 201 })
  } catch (err) {
    if (err.code === 'P2002') return Response.json({ error: 'Slug already exists' }, { status: 409 })
    return Response.json({ error: 'Failed to create news post' }, { status: 500 })
  }
}
