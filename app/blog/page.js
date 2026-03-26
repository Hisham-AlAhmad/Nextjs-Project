import PublicLayout from '@/components/public/PublicLayout'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from '@/styles/public/blog.module.css'

export const metadata = {
  title: 'Blog — Arcline Studio',
  description: 'Design insights, studio journal, and architectural perspectives.',
}

async function getData() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, tags: true, createdAt: true, author: { select: { name: true } } },
    })
    return { posts }
  } catch {
    return { posts: [] }
  }
}

export default async function BlogPage() {
  const { posts } = await getData()

  return (
    <PublicLayout>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Journal</h1>
          <p className={styles.heroSub}>Design insights, studio dispatches, and architectural perspectives.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          {posts.length === 0 ? (
            <p className={styles.empty}>No posts published yet. Check back soon.</p>
          ) : (
            <div className={styles.list}>
              {posts.map(post => {
                const tags = Array.isArray(post.tags) ? post.tags : []
                return (
                  <Link key={post.id} href={`/blog/${post.slug}`} className={styles.card}>
                    <div className={styles.cardMeta}>
                      <span className={styles.date}>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      {post.author?.name && <span className={styles.author}>by {post.author.name}</span>}
                    </div>
                    <h2 className={styles.cardTitle}>{post.title}</h2>
                    <p className={styles.cardExcerpt}>{post.excerpt}</p>
                    {tags.length > 0 && (
                      <div className={styles.tags}>
                        {tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
