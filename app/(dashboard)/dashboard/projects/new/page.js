import ProjectForm from '@/components/dashboard/ProjectForm'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { hasPermission } from '@/lib/permissions'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'New Project — Arcline Dashboard' }

export default async function NewProjectPage() {
  const session = await getServerSession(authOptions)
  if (!hasPermission(session?.user || {}, 'projects', 'add')) redirect('/dashboard/projects')

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>New Project</h1>
          <p className={styles.sub}>Add a new project to your portfolio</p>
        </div>
        <Link href="/dashboard/projects" className={styles.backBtn}>← Back</Link>
      </div>
      <ProjectForm />
    </div>
  )
}
