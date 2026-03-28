import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET(request, { params }) {
  const { page, section } = await params
  const record = await prisma.pageContent.findUnique({
    where: { page_section: { page, section } },
  })
  if (!record) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(record)
}

export async function PUT(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { page, section } = await params
  const body = await request.json()
  const { content } = body

  if (content === undefined) {
    return Response.json({ error: 'content is required' }, { status: 400 })
  }

  const record = await prisma.pageContent.upsert({
    where: { page_section: { page, section } },
    update: { content },
    create: { page, section, content },
  })

  return Response.json(record)
}
