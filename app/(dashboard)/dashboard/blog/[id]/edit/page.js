import { notFound } from 'next/navigation'
import prisma from '@/lib/prisma'
import BlogPostForm from '@/components/dashboard/BlogPostForm'
import styles from '@/styles/dashboard/form.module.css'
import Link from 'next/link'

export const metadata = { title: 'Edit Blog Post — Arcline Dashboard' }

export default async function EditBlogPostPage({ params }) {
  const { id } = await params
  const post = await prisma.blogPost.findUnique({ where: { id: Number(id) } })
  if (!post) notFound()

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Edit Blog Post</h1>
          <p className={styles.sub}>{post.title}</p>
        </div>
        <Link href="/dashboard/blog" className={styles.btnSecondary}>
          ← Back to Blog
        </Link>
      </div>
      <BlogPostForm post={post} />
    </div>
  )
}
