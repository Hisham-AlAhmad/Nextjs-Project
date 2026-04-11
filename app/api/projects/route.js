import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { hasTextContent, toPlainText } from '@/lib/richTextUtils'
import { hasPermission } from '@/lib/permissions'

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
    if (!hasPermission(session.user, 'projects', 'add')) return Response.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { title, slug, excerpt, description, category, images, details, published } = body

    const safeTitle = toPlainText(title)
    const safeSlug = toPlainText(slug)
    const safeExcerpt = toPlainText(excerpt)
    const safeDescription = toPlainText(description)
    const safeCategory = toPlainText(category)

    if (!hasTextContent(safeTitle) || !hasTextContent(safeSlug) || !hasTextContent(safeExcerpt) || !hasTextContent(safeDescription) || !hasTextContent(safeCategory)) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        title: safeTitle,
        slug: safeSlug,
        excerpt: safeExcerpt,
        description: safeDescription,
        category: safeCategory,
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
