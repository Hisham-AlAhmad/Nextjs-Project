import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import UserForm from '@/components/dashboard/UserForm'
import Link from 'next/link'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'New User — Arcline Dashboard' }

export default async function NewUserPage() {
  const session = await getServerSession(authOptions)
  if (session?.user?.role !== 'ADMIN') redirect('/dashboard')

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>New User</h1>
          <p className={styles.sub}>Create a new dashboard user</p>
        </div>
        <Link href="/dashboard/users" className={styles.backBtn}>← Back</Link>
      </div>
      <UserForm />
    </div>
  )
}
