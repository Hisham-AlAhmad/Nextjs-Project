import prisma from '@/lib/prisma'
import Link from 'next/link'
import styles from '@/styles/dashboard/list.module.css'
import DeleteButton from '@/components/dashboard/DeleteButton'

export const metadata = { title: 'Projects — Arcline Dashboard' }

export default async function ProjectsListPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Projects</h1>
          <p className={styles.sub}>{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/dashboard/projects/new" className={styles.btnNew}>
          + New Project
        </Link>
      </div>

      <div className={styles.tableCard}>
        {projects.length === 0 ? (
          <p className={styles.empty}>No projects yet. Create your first one.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(project => (
                <tr key={project.id}>
                  <td>{project.title}</td>
                  <td>{project.category}</td>
                  <td>
                    <span className={`${styles.badge} ${project.published ? styles.badgePublished : styles.badgeDraft}`}>
                      {project.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link href={`/dashboard/projects/${project.id}/edit`} className={styles.btnEdit}>
                        Edit
                      </Link>
                      <DeleteButton id={project.id} endpoint="/api/projects" />
                    </div>
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
