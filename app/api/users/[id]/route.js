import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'ADMIN') return Response.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true, role: true, permissions: true, createdAt: true },
    })
    if (!user) return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json(user)
  } catch {
    return Response.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'ADMIN') return Response.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params
    const body = await request.json()
    const { name, email, password, role, permissions } = body

    const updateData = {}
    if (name !== undefined) updateData.name = name
    if (email !== undefined) updateData.email = email
    if (role !== undefined) updateData.role = role
    if (permissions !== undefined) updateData.permissions = permissions
    if (password) {
      if (password.length < 8) return Response.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
      updateData.password = await bcrypt.hash(password, 12)
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, permissions: true, createdAt: true },
    })
    return Response.json(user)
  } catch (err) {
    if (err.code === 'P2025') return Response.json({ error: 'Not found' }, { status: 404 })
    if (err.code === 'P2002') return Response.json({ error: 'Email already exists' }, { status: 409 })
    return Response.json({ error: 'Failed to update user' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'ADMIN') return Response.json({ error: 'Forbidden' }, { status: 403 })

    const { id } = await params

    if (Number(id) === session.user.id) {
      return Response.json({ error: 'Cannot delete your own account' }, { status: 400 })
    }

    await prisma.user.delete({ where: { id: Number(id) } })
    return Response.json({ success: true })
  } catch (err) {
    if (err.code === 'P2025') return Response.json({ error: 'Not found' }, { status: 404 })
    return Response.json({ error: 'Failed to delete user' }, { status: 500 })
  }
}
