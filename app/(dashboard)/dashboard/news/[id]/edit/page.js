import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import NewsForm from '@/components/dashboard/NewsForm'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from '@/styles/dashboard/crudList.module.css'
import { authOptions } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

export const metadata = { title: 'Edit News Post — Arcline Dashboard' }

export default async function EditNewsPostPage({ params }) {
  const session = await getServerSession(authOptions)
  if (!hasPermission(session?.user || {}, 'news', 'edit')) notFound()

  const { id } = await params
  let post
  try {
    post = await prisma.newsPost.findUnique({ where: { id: Number(id) } })
  } catch {
    notFound()
  }
  if (!post) notFound()

  const safePost = JSON.parse(JSON.stringify(post))

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Edit News Post</h1>
          <p className={styles.sub}>{post.title}</p>
        </div>
        <Link href="/dashboard/news" className={styles.backBtn}>← Back</Link>
      </div>
      <NewsForm post={safePost} />
    </div>
  )
}
