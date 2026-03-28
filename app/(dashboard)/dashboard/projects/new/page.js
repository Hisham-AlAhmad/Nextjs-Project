import ProjectForm from '@/components/dashboard/ProjectForm'
import Link from 'next/link'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'New Project — Arcline Dashboard' }

export default function NewProjectPage() {
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
