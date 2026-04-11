import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import UserForm from '@/components/dashboard/UserForm'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'Edit User — Arcline Dashboard' }

export default async function EditUserPage({ params }) {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  const { id } = await params
  let user
  try {
    user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { id: true, name: true, email: true, role: true, permissions: true, dashboardRoleId: true },
    })
  } catch {
    notFound()
  }
  if (!user) notFound()

  const safeUser = JSON.parse(JSON.stringify(user))

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Edit User</h1>
          <p className={styles.sub}>{user.name}</p>
        </div>
        <Link href="/dashboard/users" className={styles.backBtn}>← Back</Link>
      </div>
      <UserForm user={safeUser} />
    </div>
  )
}
