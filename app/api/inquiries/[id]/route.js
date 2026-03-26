import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const { read } = body

    const inquiry = await prisma.projectInquiry.update({
      where: { id: Number(id) },
      data: { read: Boolean(read) },
    })
    return Response.json(inquiry)
  } catch (err) {
    if (err.code === 'P2025') return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'ADMIN') return Response.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    await prisma.projectInquiry.delete({ where: { id: Number(id) } })
    return Response.json({ success: true })
  } catch (err) {
    if (err.code === 'P2025') return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
