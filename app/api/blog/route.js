import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/richTextUtils'

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { id: true, name: true } } },
  })
  return Response.json(posts)
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, excerpt, content, tags, published } = body

  if (!title || !excerpt || !content) {
    return Response.json({ error: 'title, excerpt and content are required' }, { status: 400 })
  }

  const baseSlug = slugify(title)
  let slug = baseSlug
  let counter = 1
  while (await prisma.blogPost.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`
  }

  const post = await prisma.blogPost.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      tags: tags ?? [],
      published: published ?? false,
      authorId: session.user.id,
    },
  })

  return Response.json(post, { status: 201 })
}
