import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import ProjectForm from '@/components/dashboard/ProjectForm'
import styles from '@/styles/dashboard/form.module.css'
import Link from 'next/link'

export const metadata = { title: 'Edit Project — Arcline Dashboard' }

export default async function EditProjectPage({ params }) {
  const { id } = await params
  const project = await prisma.project.findUnique({ where: { id: Number(id) } })
  if (!project) notFound()

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Edit Project</h1>
          <p className={styles.sub}>{project.title}</p>
        </div>
        <Link href="/dashboard/projects" className={styles.btnSecondary}>
          ← Back to Projects
        </Link>
      </div>
      <ProjectForm project={project} />
    </div>
  )
}
