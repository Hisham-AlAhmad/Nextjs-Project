import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { normalizePermissions } from '@/lib/permissions'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
        if (session.user.role !== 'ADMIN') return Response.json({ error: 'Forbidden' }, { status: 403 })

        const roles = await prisma.dashboardRole.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { users: true } } },
        })

        return Response.json(roles)
    } catch {
        return Response.json({ error: 'Failed to fetch roles' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
        if (session.user.role !== 'ADMIN') return Response.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const name = typeof body?.name === 'string' ? body.name.trim() : ''
        const permissions = normalizePermissions(body?.permissions)

        if (!name) {
            return Response.json({ error: 'Role name is required' }, { status: 400 })
        }

        if (permissions.length === 0) {
            return Response.json({ error: 'Select at least one permission' }, { status: 400 })
        }

        const role = await prisma.dashboardRole.create({
            data: { name, permissions },
            include: { _count: { select: { users: true } } },
        })

        return Response.json(role, { status: 201 })
    } catch (err) {
        if (err?.code === 'P2002') {
            return Response.json({ error: 'A role with this name already exists' }, { status: 409 })
        }
        return Response.json({ error: 'Failed to create role' }, { status: 500 })
    }
}
