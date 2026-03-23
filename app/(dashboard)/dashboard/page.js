import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import styles from '@/styles/dashboard/overview.module.css'

export const metadata = {
  title: 'Overview — Arcline Dashboard'
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  // Run all queries in parallel instead of one by one
  // Raw SQL equivalent:
  // SELECT COUNT(*) FROM projects WHERE published = true
  // SELECT COUNT(*) FROM blog_posts
  // SELECT COUNT(*) FROM contact_submissions WHERE read = false
  // SELECT COUNT(*) FROM project_inquiries WHERE read = false
  const [
    publishedProjects,
    totalBlogs,
    unreadContacts,
    unreadInquiries,
    recentProjects,
    recentSubmissions
  ] = await Promise.all([
    prisma.project.count({ where: { published: true } }),
    prisma.blogPost.count(),
    prisma.contactSubmission.count({ where: { read: false } }),
    prisma.projectInquiry.count({ where: { read: false } }),

    // Raw SQL equivalent:
    // SELECT * FROM projects ORDER BY created_at DESC LIMIT 5
    prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        category: true,
        published: true,
        createdAt: true
      }
    }),

    // Raw SQL equivalent:
    // SELECT * FROM contact_submissions ORDER BY created_at DESC LIMIT 5
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        projectType: true,
        read: true,
        createdAt: true
      }
    })
  ])

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Overview</h1>
        <p className={styles.sub}>Welcome back, {session.user.name}.</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Published Projects</span>
          <span className={styles.statValue}>{publishedProjects}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Blog Posts</span>
          <span className={styles.statValue}>{totalBlogs}</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Unread Contacts</span>
          <span className={`${styles.statValue} ${unreadContacts > 0 ? styles.statAlert : ''}`}>
            {unreadContacts}
          </span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Unread Inquiries</span>
          <span className={`${styles.statValue} ${unreadInquiries > 0 ? styles.statAlert : ''}`}>
            {unreadInquiries}
          </span>
        </div>
      </div>

      <div className={styles.tables}>
        {/* Recent Projects */}
        <div className={styles.tableCard}>
          <h2 className={styles.tableTitle}>Recent Projects</h2>
          {recentProjects.length === 0 ? (
            <p className={styles.empty}>No projects yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.map(project => (
                  <tr key={project.id}>
                    <td>{project.title}</td>
                    <td>{project.category}</td>
                    <td>
                      <span className={`${styles.badge} ${project.published ? styles.badgePublished : styles.badgeDraft}`}>
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td>{new Date(project.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Recent Submissions */}
        <div className={styles.tableCard}>
          <h2 className={styles.tableTitle}>Recent Contact Submissions</h2>
          {recentSubmissions.length === 0 ? (
            <p className={styles.empty}>No submissions yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map(sub => (
                  <tr key={sub.id}>
                    <td>{sub.name}</td>
                    <td>{sub.projectType || '—'}</td>
                    <td>
                      <span className={`${styles.badge} ${!sub.read ? styles.badgeUnread : styles.badgeRead}`}>
                        {sub.read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td>{new Date(sub.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}