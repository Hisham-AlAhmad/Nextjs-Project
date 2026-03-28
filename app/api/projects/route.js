import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    })
    return Response.json(projects)
  } catch (err) {
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, slug, excerpt, description, category, images, details, published } = body

    if (!title || !slug || !excerpt || !description || !category) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        excerpt,
        description,
        category,
        images: images || [],
        details: details || {},
        published: published ?? false,
      },
    })
    return Response.json(project, { status: 201 })
  } catch (err) {
    if (err.code === 'P2002') {
      return Response.json({ error: 'A project with this slug already exists' }, { status: 409 })
    }
    return Response.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
