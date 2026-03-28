import prisma from '@/lib/prisma'
import Link from 'next/link'
import styles from '@/styles/dashboard/list.module.css'
import DeleteButton from '@/components/dashboard/DeleteButton'

export const metadata = { title: 'News — Arcline Dashboard' }

export default async function NewsListPage() {
  const posts = await prisma.newsPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } },
  })

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>News</h1>
          <p className={styles.sub}>{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/dashboard/news/new" className={styles.btnNew}>
          + New Post
        </Link>
      </div>

      <div className={styles.tableCard}>
        {posts.length === 0 ? (
          <p className={styles.empty}>No news posts yet. Create your first one.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td>{post.author.name}</td>
                  <td>
                    <span className={`${styles.badge} ${post.published ? styles.badgePublished : styles.badgeDraft}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.rowActions}>
                      <Link href={`/dashboard/news/${post.id}/edit`} className={styles.btnEdit}>
                        Edit
                      </Link>
                      <DeleteButton id={post.id} endpoint="/api/news" />
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
