import PublicLayout from '@/components/public/PublicLayout'
import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import styles from '@/styles/public/home.module.css'

export const metadata = {
  title: 'Arcline — Architecture Design Studio',
  description: 'Architecture + perfect lines. A design studio crafting spaces that endure.',
}

async function getData() {
  try {
    const [heroContent, statsContent, projects, posts, news] = await Promise.all([
      prisma.pageContent.findUnique({ where: { page_section: { page: 'home', section: 'hero' } } }),
      prisma.pageContent.findUnique({ where: { page_section: { page: 'home', section: 'stats' } } }),
      prisma.project.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 6, select: { id: true, title: true, slug: true, excerpt: true, category: true, images: true } }),
      prisma.blogPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3, select: { id: true, title: true, slug: true, excerpt: true, coverImage: true, createdAt: true } }),
      prisma.newsPost.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 2, select: { id: true, title: true, slug: true, coverImage: true } }),
    ])

    const gallery = projects
      .flatMap(project => (Array.isArray(project.images) ? project.images : []))
      .filter(Boolean)
      .slice(0, 8)

    return { heroContent, statsContent, projects, posts, news, gallery }
  } catch {
    return { heroContent: null, statsContent: null, projects: [], posts: [], news: [], gallery: [] }
  }
}

export default async function HomePage() {
  const { heroContent, statsContent, projects, posts, news, gallery } = await getData()

  const hero = heroContent?.content || {
    badge: 'Award-winning architecture studio',
    heading: 'Spaces That Endure',
    subheading: 'We design architecture that transcends trends — rooted in precision, shaped by vision.',
    ctaText: 'View Our Work',
    ctaSecondaryText: 'Explore Journal',
    highlightOne: 'Concept to Completion',
    highlightTwo: 'Interior + Architecture',
    imagePrimary: '',
    imageSecondary: '',
  }

  const heroPrimaryImage = hero.imagePrimary || gallery[0] || posts[0]?.coverImage || news[0]?.coverImage || ''
  const heroSecondaryImage = hero.imageSecondary || gallery[1] || posts[1]?.coverImage || news[1]?.coverImage || ''

  const stats = statsContent?.content || {
    projects: '120+',
    years: '15',
    awards: '30+',
    countries: '8',
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlowA} />
        <div className={styles.heroGlowB} />
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.heroBadge}>{hero.badge || 'Award-winning architecture studio'}</span>
            <h1 className={styles.heroHeading}>{hero.heading}</h1>
            <p className={styles.heroSub}>{hero.subheading}</p>
            <div className={styles.heroHighlights}>
              <span className={styles.heroPill}>{hero.highlightOne || 'Concept to Completion'}</span>
              <span className={styles.heroPill}>{hero.highlightTwo || 'Interior + Architecture'}</span>
            </div>
            <div className={styles.heroCtas}>
              <Link href="/projects" className={styles.heroCta}>{hero.ctaText || 'View Our Work'}</Link>
              <Link href="/blog" className={styles.heroCtaSecondary}>{hero.ctaSecondaryText || 'Explore Journal'}</Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            {heroPrimaryImage && (
              <div className={styles.heroImagePrimary}>
                <Image src={heroPrimaryImage} alt="Featured architecture project" fill className={styles.img} priority />
              </div>
            )}
            {heroSecondaryImage && (
              <div className={styles.heroImageSecondary}>
                <Image src={heroSecondaryImage} alt="Studio highlight" fill className={styles.img} />
              </div>
            )}
            <div className={styles.heroFloatingCard}>Live project delivery in 8 countries</div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
        <div className={styles.statsInner}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.projects}</span>
            <span className={styles.statLabel}>Projects Delivered</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.years}</span>
            <span className={styles.statLabel}>Years of Practice</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.awards}</span>
            <span className={styles.statLabel}>Design Awards</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>{stats.countries}</span>
            <span className={styles.statLabel}>Countries</span>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Selected Work</h2>
            <Link href="/projects" className={styles.sectionLink}>All Projects →</Link>
          </div>
          {projects.length === 0 ? (
            <p className={styles.empty}>No projects published yet.</p>
          ) : (
            <div className={styles.projectsGrid}>
              {projects.map(project => {
                const images = Array.isArray(project.images) ? project.images : []
                return (
                  <Link key={project.id} href={`/projects/${project.slug}`} className={styles.projectCard}>
                    <div className={styles.projectImage}>
                      {images[0] && <Image src={images[0]} alt={project.title} fill className={styles.img} />}
                    </div>
                    <div className={styles.projectInfo}>
                      <span className={styles.projectCategory}>{project.category}</span>
                      <h3 className={styles.projectTitle}>{project.title}</h3>
                      <p className={styles.projectExcerpt}>{project.excerpt}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Studio Gallery</h2>
              <Link href="/projects" className={styles.sectionLink}>More Visual Stories →</Link>
            </div>
            <div className={styles.galleryGrid}>
              {gallery.map((image, index) => (
                <div key={`${image}-${index}`} className={styles.galleryItem}>
                  <Image src={image} alt={`Gallery image ${index + 1}`} fill className={styles.img} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Teaser */}
      <section className={styles.about}>
        <div className={styles.aboutInner}>
          <div className={styles.aboutText}>
            <h2 className={styles.aboutTitle}>A Studio Built on Precision</h2>
            <p className={styles.aboutBody}>
              Founded in 2009, Arcline is an architecture and interior design studio committed to
              creating spaces that are both beautiful and enduring. Our multidisciplinary team
              blends technical rigor with creative intuition.
            </p>
            <Link href="/about" className={styles.aboutLink}>Learn About Us →</Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      {posts.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionInner}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Journal</h2>
              <Link href="/blog" className={styles.sectionLink}>All Posts →</Link>
            </div>
            <div className={styles.blogGrid}>
              {posts.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className={styles.blogCard}>
                  {post.coverImage && (
                    <div className={styles.blogImageWrap}>
                      <Image src={post.coverImage} alt={post.title} fill className={styles.img} />
                    </div>
                  )}
                  <span className={styles.blogDate}>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <h3 className={styles.blogTitle}>{post.title}</h3>
                  <p className={styles.blogExcerpt}>{post.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </PublicLayout>
  )
}