import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/richTextUtils'

export async function GET(request, { params }) {
  const { id } = await params
  const post = await prisma.newsPost.findUnique({
    where: { id: Number(id) },
    include: { author: { select: { id: true, name: true } } },
  })
  if (!post) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(post)
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { title, excerpt, content, published } = body

  const existing = await prisma.newsPost.findUnique({ where: { id: Number(id) } })
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

  let slug = existing.slug
  if (title && title !== existing.title) {
    const baseSlug = slugify(title)
    slug = baseSlug
    let counter = 1
    while (await prisma.newsPost.findFirst({ where: { slug, NOT: { id: Number(id) } } })) {
      slug = `${baseSlug}-${counter++}`
    }
  }

  const post = await prisma.newsPost.update({
    where: { id: Number(id) },
    data: {
      title: title ?? existing.title,
      slug,
      excerpt: excerpt ?? existing.excerpt,
      content: content ?? existing.content,
      published: published ?? existing.published,
    },
  })

  return Response.json(post)
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.newsPost.delete({ where: { id: Number(id) } })
  return Response.json({ success: true })
}
