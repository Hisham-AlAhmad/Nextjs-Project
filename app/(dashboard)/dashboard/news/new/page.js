import NewsPostForm from '@/components/dashboard/NewsPostForm'
import styles from '@/styles/dashboard/form.module.css'
import Link from 'next/link'

export const metadata = { title: 'New News Post — Arcline Dashboard' }

export default function NewNewsPostPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>New News Post</h1>
          <p className={styles.sub}>Create a press release, award or announcement</p>
        </div>
        <Link href="/dashboard/news" className={styles.btnSecondary}>
          ← Back to News
        </Link>
      </div>
      <NewsPostForm />
    </div>
  )
}
