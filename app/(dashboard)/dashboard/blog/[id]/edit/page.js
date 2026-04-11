import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import BlogForm from '@/components/dashboard/BlogForm'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from '@/styles/dashboard/crudList.module.css'
import { authOptions } from '@/lib/auth'
import { hasPermission } from '@/lib/permissions'

export const metadata = { title: 'Edit Post — Arcline Dashboard' }

export default async function EditBlogPostPage({ params }) {
  const session = await getServerSession(authOptions)
  if (!hasPermission(session?.user || {}, 'blog', 'edit')) notFound()

  const { id } = await params
  let post
  try {
    post = await prisma.blogPost.findUnique({ where: { id: Number(id) } })
  } catch {
    notFound()
  }
  if (!post) notFound()

  const safePost = JSON.parse(JSON.stringify(post))

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Edit Post</h1>
          <p className={styles.sub}>{post.title}</p>
        </div>
        <Link href="/dashboard/blog" className={styles.backBtn}>← Back</Link>
      </div>
      <BlogForm post={safePost} />
    </div>
  )
}
