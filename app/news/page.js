import PublicLayout from '@/components/public/PublicLayout'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from '@/styles/public/blog.module.css'

export const metadata = {
  title: 'News — Arcline Studio',
  description: 'Press releases, awards, and announcements from Arcline Studio.',
}

async function getData() {
  try {
    const posts = await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, createdAt: true, author: { select: { name: true } } },
    })
    return { posts }
  } catch {
    return { posts: [] }
  }
}

export default async function NewsPage() {
  const { posts } = await getData()

  return (
    <PublicLayout>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>News</h1>
          <p className={styles.heroSub}>Press releases, awards, and studio announcements.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          {posts.length === 0 ? (
            <p className={styles.empty}>No news published yet. Check back soon.</p>
          ) : (
            <div className={styles.list}>
              {posts.map(post => (
                <Link key={post.id} href={`/news/${post.slug}`} className={styles.card}>
                  <div className={styles.cardMeta}>
                    <span className={styles.date}>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    {post.author?.name && <span className={styles.author}>by {post.author.name}</span>}
                  </div>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <p className={styles.cardExcerpt}>{post.excerpt}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
