import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { slugify } from '@/lib/richTextUtils'

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return Response.json(projects)
}

export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { title, excerpt, description, category, images, details, published } = body

  if (!title || !excerpt || !description || !category) {
    return Response.json({ error: 'title, excerpt, description and category are required' }, { status: 400 })
  }

  const baseSlug = slugify(title)
  let slug = baseSlug
  let counter = 1
  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`
  }

  const project = await prisma.project.create({
    data: {
      title,
      slug,
      excerpt,
      description,
      category,
      images: images ?? [],
      details: details ?? {},
      published: published ?? false,
    },
  })

  return Response.json(project, { status: 201 })
}
