import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'Users — Arcline Dashboard' }

export default async function UsersPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  let users = []
  try {
    users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, role: true, permissions: true, dashboardRoleId: true, dashboardRole: { select: { name: true } }, createdAt: true },
    })
  } catch { }

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Users</h1>
          <p className={styles.sub}>{users.length} user{users.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/users/new" className={styles.newBtn}>+ New User</Link>
      </div>

      <div className={styles.card}>
        {users.length === 0 ? (
          <p className={styles.empty}>No users found.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Assigned Role</th>
                <th>Permissions</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => {
                const perms = Array.isArray(user.permissions) ? user.permissions : []
                return (
                  <tr key={user.id}>
                    <td className={styles.tdTitle}>{user.name}</td>
                    <td className={styles.tdMuted}>{user.email}</td>
                    <td>
                      <span className={`${styles.badge} ${user.role === 'ADMIN' ? styles.badgePublished : styles.badgeDraft}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className={styles.tdMuted}>{user.dashboardRole?.name || (user.role === 'ADMIN' ? 'System Admin' : 'Custom')}</td>
                    <td className={styles.tdMuted}>
                      {user.role === 'ADMIN' ? 'All' : perms.length > 0 ? perms.join(', ') : 'None'}
                    </td>
                    <td className={styles.tdMuted}>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link href={`/dashboard/users/${user.id}/edit`} className={styles.editLink}>Edit</Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
