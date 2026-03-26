import { notFound } from 'next/navigation'
import PublicLayout from '@/components/public/PublicLayout'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from '@/styles/public/blogDetail.module.css'

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params
    const post = await prisma.blogPost.findUnique({ where: { slug, published: true }, select: { title: true, excerpt: true } })
    if (!post) return {}
    return { title: `${post.title} — Arcline Journal`, description: post.excerpt }
  } catch {
    return {}
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params
  let post
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug, published: true },
      include: { author: { select: { name: true } } },
    })
  } catch {
    notFound()
  }
  if (!post) notFound()

  const tags = Array.isArray(post.tags) ? post.tags : []

  return (
    <PublicLayout>
      <article>
        <header className={styles.header}>
          <div className={styles.headerInner}>
            {tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
              </div>
            )}
            <h1 className={styles.title}>{post.title}</h1>
            <p className={styles.excerpt}>{post.excerpt}</p>
            <div className={styles.meta}>
              {post.author?.name && <span>By {post.author.name}</span>}
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>
        </header>

        <div className={styles.body}>
          <div className={styles.bodyInner}>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <Link href="/blog" className={styles.back}>← Back to Journal</Link>
          </div>
        </div>
      </article>
    </PublicLayout>
  )
}
