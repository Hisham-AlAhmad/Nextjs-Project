import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import NewsPostForm from '@/components/dashboard/NewsPostForm'
import styles from '@/styles/dashboard/form.module.css'
import Link from 'next/link'

export const metadata = { title: 'Edit News Post — Arcline Dashboard' }

export default async function EditNewsPostPage({ params }) {
  const { id } = await params
  const post = await prisma.newsPost.findUnique({ where: { id: Number(id) } })
  if (!post) notFound()

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Edit News Post</h1>
          <p className={styles.sub}>{post.title}</p>
        </div>
        <Link href="/dashboard/news" className={styles.btnSecondary}>
          ← Back to News
        </Link>
      </div>
      <NewsPostForm post={post} />
    </div>
  )
}
