import { notFound } from 'next/navigation'
import ProjectForm from '@/components/dashboard/ProjectForm'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'Edit Project — Arcline Dashboard' }

export default async function EditProjectPage({ params }) {
  const { id } = await params
  let project
  try {
    project = await prisma.project.findUnique({ where: { id: Number(id) } })
  } catch {
    notFound()
  }
  if (!project) notFound()

  // Convert BigInt/special values to plain JSON for client component
  const safeProject = JSON.parse(JSON.stringify(project))

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Edit Project</h1>
          <p className={styles.sub}>{project.title}</p>
        </div>
        <Link href="/dashboard/projects" className={styles.backBtn}>← Back</Link>
      </div>
      <ProjectForm project={safeProject} />
    </div>
  )
}
