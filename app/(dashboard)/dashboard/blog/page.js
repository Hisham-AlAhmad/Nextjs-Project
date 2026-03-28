import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'Blog — Arcline Dashboard' }

export default async function DashboardBlogPage() {
  let posts = []
  try {
    posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, published: true, createdAt: true, author: { select: { name: true } } },
    })
  } catch {}

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Blog</h1>
          <p className={styles.sub}>{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/dashboard/blog/new" className={styles.newBtn}>+ New Post</Link>
      </div>

      <div className={styles.card}>
        {posts.length === 0 ? (
          <p className={styles.empty}>No posts yet. <Link href="/dashboard/blog/new" className={styles.emptyLink}>Write your first one →</Link></p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id}>
                  <td className={styles.tdTitle}>{post.title}</td>
                  <td className={styles.tdMuted}>{post.author?.name || '—'}</td>
                  <td>
                    <span className={`${styles.badge} ${post.published ? styles.badgePublished : styles.badgeDraft}`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className={styles.tdMuted}>{new Date(post.createdAt).toLocaleDateString()}</td>
                  <td>
                    <Link href={`/dashboard/blog/${post.id}/edit`} className={styles.editLink}>Edit</Link>
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
