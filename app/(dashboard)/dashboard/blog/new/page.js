import BlogPostForm from '@/components/dashboard/BlogPostForm'
import styles from '@/styles/dashboard/form.module.css'
import Link from 'next/link'

export const metadata = { title: 'New Blog Post — Arcline Dashboard' }

export default function NewBlogPostPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>New Blog Post</h1>
          <p className={styles.sub}>Write and publish a new post</p>
        </div>
        <Link href="/dashboard/blog" className={styles.btnSecondary}>
          ← Back to Blog
        </Link>
      </div>
      <BlogPostForm />
    </div>
  )
}
