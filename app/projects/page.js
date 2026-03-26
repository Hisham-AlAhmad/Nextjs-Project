import PublicLayout from '@/components/public/PublicLayout'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from '@/styles/public/projects.module.css'

export const metadata = {
  title: 'Projects — Arcline Studio',
  description: 'Explore our portfolio of architectural and interior design projects.',
}

async function getData() {
  try {
    const projects = await prisma.project.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, category: true, images: true, createdAt: true },
    })
    return { projects }
  } catch {
    return { projects: [] }
  }
}

export default async function ProjectsPage() {
  const { projects } = await getData()
  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]

  return (
    <PublicLayout>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Our Projects</h1>
          <p className={styles.heroSub}>{projects.length} published project{projects.length !== 1 ? 's' : ''}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          {projects.length === 0 ? (
            <p className={styles.empty}>No projects published yet. Check back soon.</p>
          ) : (
            <div className={styles.grid}>
              {projects.map(project => {
                const images = Array.isArray(project.images) ? project.images : []
                return (
                  <Link key={project.id} href={`/projects/${project.slug}`} className={styles.card}>
                    <div className={styles.cardImage}>
                      {images[0] && <img src={images[0]} alt={project.title} className={styles.img} />}
                    </div>
                    <div className={styles.cardBody}>
                      <span className={styles.category}>{project.category}</span>
                      <h2 className={styles.title}>{project.title}</h2>
                      <p className={styles.excerpt}>{project.excerpt}</p>
                    </div>
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
