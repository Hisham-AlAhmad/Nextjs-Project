import BlogForm from '@/components/dashboard/BlogForm'
import Link from 'next/link'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'New Post — Arcline Dashboard' }

export default function NewBlogPostPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>New Blog Post</h1>
          <p className={styles.sub}>Write a new journal entry</p>
        </div>
        <Link href="/dashboard/blog" className={styles.backBtn}>← Back</Link>
      </div>
      <BlogForm />
    </div>
  )
}
