import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import styles from '@/styles/dashboard/list.module.css'
import DeleteButton from '@/components/dashboard/DeleteButton'

export const metadata = { title: 'Blog — Arcline Dashboard' }

export default async function BlogListPage() {
  await getServerSession(authOptions)

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: { select: { name: true } } },
  })

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Blog Posts</h1>
          <p className={styles.sub}>{posts.length} post{posts.length !== 1 ? 's' : ''} total</p>
        </div>
        <Link href="/dashboard/blog/new" className={styles.btnNew}>
          + New Post
        </Link>
      </div>

      <div className={styles.tableCard}>
        {posts.length === 0 ? (
          <p className={styles.empty}>No blog posts yet. Create your first one.</p>
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
                      <Link href={`/dashboard/blog/${post.id}/edit`} className={styles.btnEdit}>
                        Edit
                      </Link>
                      <DeleteButton id={post.id} endpoint="/api/blog" />
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
