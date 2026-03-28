import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const updated = await prisma.projectInquiry.update({
    where: { id: Number(id) },
    data: { read: body.read },
  })
  return Response.json(updated)
}

export async function DELETE(request, { params }) {
  const session = await getServerSession(authOptions)
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  if (session.user.role !== 'ADMIN') return Response.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  await prisma.projectInquiry.delete({ where: { id: Number(id) } })
  return Response.json({ success: true })
}
