import NewsForm from '@/components/dashboard/NewsForm'
import Link from 'next/link'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'New News Post — Arcline Dashboard' }

export default function NewNewsPostPage() {
  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>New News Post</h1>
          <p className={styles.sub}>Add a press release or announcement</p>
        </div>
        <Link href="/dashboard/news" className={styles.backBtn}>← Back</Link>
      </div>
      <NewsForm />
    </div>
  )
}
