import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')

    const sections = await prisma.pageContent.findMany({
      where: page ? { page } : {},
      orderBy: [{ page: 'asc' }, { section: 'asc' }],
    })
    return Response.json(sections)
  } catch {
    return Response.json({ error: 'Failed to fetch page content' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { page, section, content } = body

    if (!page || !section || content === undefined) {
      return Response.json({ error: 'page, section, and content are required' }, { status: 400 })
    }

    const result = await prisma.pageContent.upsert({
      where: { page_section: { page, section } },
      create: { page, section, content },
      update: { content },
    })
    return Response.json(result)
  } catch {
    return Response.json({ error: 'Failed to save page content' }, { status: 500 })
  }
}
