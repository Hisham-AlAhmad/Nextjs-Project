import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { normalizePermissions } from '@/lib/permissions'

export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
        if (session.user.role !== 'ADMIN') return Response.json({ error: 'Forbidden' }, { status: 403 })

        const { id } = await params
        const role = await prisma.dashboardRole.findUnique({
            where: { id: Number(id) },
            include: { _count: { select: { users: true } } },
        })

        if (!role) return Response.json({ error: 'Not found' }, { status: 404 })
        return Response.json(role)
    } catch {
        return Response.json({ error: 'Failed to fetch role' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
        if (session.user.role !== 'ADMIN') return Response.json({ error: 'Forbidden' }, { status: 403 })

        const { id } = await params
        const body = await request.json()

        const name = typeof body?.name === 'string' ? body.name.trim() : ''
        const permissions = normalizePermissions(body?.permissions)

        if (!name) {
            return Response.json({ error: 'Role name is required' }, { status: 400 })
        }

        if (permissions.length === 0) {
            return Response.json({ error: 'Select at least one permission' }, { status: 400 })
        }

        const role = await prisma.dashboardRole.update({
            where: { id: Number(id) },
            data: { name, permissions },
            include: { _count: { select: { users: true } } },
        })

        return Response.json(role)
    } catch (err) {
        if (err?.code === 'P2025') return Response.json({ error: 'Not found' }, { status: 404 })
        if (err?.code === 'P2002') return Response.json({ error: 'A role with this name already exists' }, { status: 409 })
        return Response.json({ error: 'Failed to update role' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
        if (session.user.role !== 'ADMIN') return Response.json({ error: 'Forbidden' }, { status: 403 })

        const { id } = await params
        const roleId = Number(id)

        const assignedCount = await prisma.user.count({ where: { dashboardRoleId: roleId } })
        if (assignedCount > 0) {
            return Response.json({ error: 'Unassign this role from users before deleting it' }, { status: 400 })
        }

        await prisma.dashboardRole.delete({ where: { id: roleId } })
        return Response.json({ success: true })
    } catch (err) {
        if (err?.code === 'P2025') return Response.json({ error: 'Not found' }, { status: 404 })
        return Response.json({ error: 'Failed to delete role' }, { status: 500 })
    }
}
