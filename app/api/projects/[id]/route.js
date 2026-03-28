import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/richTextUtils'

export async function GET(request, { params }) {
  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id: Number(id) } })
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(project)
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { title, excerpt, description, category, images, details, published } = body

  const existing = await prisma.project.findUnique({ where: { id: Number(id) } })
  if (!existing) return Response.json({ error: 'Not found' }, { status: 404 })

  let slug = existing.slug
  if (title && title !== existing.title) {
    const baseSlug = slugify(title)
    slug = baseSlug
    let counter = 1
    while (await prisma.project.findFirst({ where: { slug, NOT: { id: Number(id) } } })) {
      slug = `${baseSlug}-${counter++}`
    }
  }

  const project = await prisma.project.update({
    where: { id: Number(id) },
    data: {
      title: title ?? existing.title,
      slug,
      excerpt: excerpt ?? existing.excerpt,
      description: description ?? existing.description,
      category: category ?? existing.category,
      images: images ?? existing.images,
      details: details ?? existing.details,
      published: published ?? existing.published,
    },
  })

  return Response.json(project)
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.project.delete({ where: { id: Number(id) } })
  return Response.json({ success: true })
}
