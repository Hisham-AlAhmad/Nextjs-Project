import { notFound } from 'next/navigation'
import PublicLayout from '@/components/public/PublicLayout'
import ProjectInquiryForm from '@/components/public/ProjectInquiryForm'
import Link from 'next/link'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import { toPlainText } from '@/lib/richTextUtils'
import styles from '@/styles/public/projectDetail.module.css'

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params
    const project = await prisma.project.findUnique({ where: { slug, published: true }, select: { title: true, excerpt: true } })
    if (!project) return {}
    return { title: `${project.title} — Arcline Studio`, description: project.excerpt }
  } catch {
    return {}
  }
}

export default async function ProjectDetailPage({ params }) {
  const { slug } = await params
  let project
  try {
    project = await prisma.project.findUnique({
      where: { slug, published: true },
    })
  } catch {
    notFound()
  }
  if (!project) notFound()

  const images = Array.isArray(project.images) ? project.images : []
  const details = project.details && typeof project.details === 'object' ? project.details : {}
  const descriptionText = toPlainText(project.description)

  return (
    <PublicLayout>
      {/* Hero */}
      <section className={styles.hero}>
        {images[0] && (
          <div className={styles.heroImage}>
            <Image src={images[0]} alt={project.title} fill className={styles.heroImg} />
          </div>
        )}
        <div className={styles.heroOverlay}>
          <div className={styles.heroInner}>
            <span className={styles.heroCategory}>{project.category}</span>
            <h1 className={styles.heroTitle}>{project.title}</h1>
          </div>
        </div>
      </section>

      <div className={styles.layout}>
        {/* Main Content */}
        <div className={styles.main}>
          <p className={styles.excerpt}>{project.excerpt}</p>
          <div className={styles.content} style={{ whiteSpace: 'pre-line' }}>
            {descriptionText}
          </div>

          {/* Image Gallery */}
          {images.length > 1 && (
            <div className={styles.gallery}>
              {images.slice(1).map((img, i) => (
                <div key={i} className={styles.galleryItem}>
                  <Image src={img} alt={`${project.title} ${i + 2}`} fill className={styles.galleryImg} />
                </div>
              ))}
            </div>
          )}

          {/* Inquiry Form */}
          <div className={styles.inquirySection}>
            <h2 className={styles.inquiryTitle}>Interested in a Similar Project?</h2>
            <p className={styles.inquirySub}>Send us a message and we will get back to you.</p>
            <ProjectInquiryForm projectId={project.id} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {Object.keys(details).length > 0 && (
            <div className={styles.detailsCard}>
              <h3 className={styles.detailsTitle}>Project Details</h3>
              <dl className={styles.detailsList}>
                {Object.entries(details).map(([key, value]) => (
                  <div key={key} className={styles.detailItem}>
                    <dt className={styles.detailKey}>{key}</dt>
                    <dd className={styles.detailVal}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
          <Link href="/projects" className={styles.backLink}>← All Projects</Link>
        </aside>
      </div>
    </PublicLayout>
  )
}
