import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasTextContent, toPlainText } from '@/lib/richTextUtils'

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true } } },
    })
    return Response.json(posts)
  } catch {
    return Response.json({ error: 'Failed to fetch posts' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, slug, excerpt, content, tags, published } = body

    const safeTitle = toPlainText(title)
    const safeSlug = toPlainText(slug)
    const safeExcerpt = toPlainText(excerpt)
    const safeContent = toPlainText(content)

    if (!hasTextContent(safeTitle) || !hasTextContent(safeSlug) || !hasTextContent(safeExcerpt) || !hasTextContent(safeContent)) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const post = await prisma.blogPost.create({
      data: {
        title: safeTitle,
        slug: safeSlug,
        excerpt: safeExcerpt,
        content: safeContent,
        tags: tags || [],
        published: published ?? false,
        authorId: session.user.id,
      },
    })
    return Response.json(post, { status: 201 })
  } catch (err) {
    if (err.code === 'P2002') return Response.json({ error: 'Slug already exists' }, { status: 409 })
    return Response.json({ error: 'Failed to create post' }, { status: 500 })
  }
}
