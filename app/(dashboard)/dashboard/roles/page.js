import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import RoleManager from '@/components/dashboard/RoleManager'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'Roles — Arcline Dashboard' }

export default async function RolesPage() {
    const session = await getServerSession(authOptions)
    if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

    let roles = []
    try {
        roles = await prisma.dashboardRole.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { users: true } } },
        })
    } catch { }

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Roles</h1>
                    <p className={styles.sub}>Create reusable permissions and assign them to editors.</p>
                </div>
            </div>

            <RoleManager initialRoles={JSON.parse(JSON.stringify(roles))} />
        </div>
    )
}
