import ProjectForm from '@/components/dashboard/ProjectForm'
import styles from '@/styles/dashboard/form.module.css'
import Link from 'next/link'

export const metadata = { title: 'New Project — Arcline Dashboard' }

export default function NewProjectPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>New Project</h1>
          <p className={styles.sub}>Add a new project to your portfolio</p>
        </div>
        <Link href="/dashboard/projects" className={styles.btnSecondary}>
          ← Back to Projects
        </Link>
      </div>
      <ProjectForm />
    </div>
  )
}
