import BlogForm from '@/components/dashboard/BlogForm'
import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { hasPermission } from '@/lib/permissions'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'New Post — Arcline Dashboard' }

export default async function NewBlogPostPage() {
  const session = await getServerSession(authOptions)
  if (!hasPermission(session?.user || {}, 'blog', 'add')) redirect('/dashboard/blog')

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
