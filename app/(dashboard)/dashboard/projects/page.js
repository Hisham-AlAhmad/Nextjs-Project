import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'Projects — Arcline Dashboard' }

export default async function DashboardProjectsPage() {
  const session = await getServerSession(authOptions)

  let projects = []
  try {
    projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, category: true, published: true, createdAt: true },
    })
  } catch {}

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.sub}>{projects.length} total</p>
        </div>
        <Link href="/dashboard/projects/new" className={styles.newBtn}>+ New Project</Link>
      </div>

      <div className={styles.card}>
        {projects.length === 0 ? (
          <p className={styles.empty}>No projects yet. <Link href="/dashboard/projects/new" className={styles.emptyLink}>Create your first one →</Link></p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td className={styles.tdTitle}>{project.title}</td>
                  <td>{project.category}</td>
                  <td>
                    <span className={`${styles.badge} ${project.published ? styles.badgePublished : styles.badgeDraft}`}>
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className={styles.tdMuted}>{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/dashboard/projects/${project.id}/edit`} className={styles.editLink}>Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
