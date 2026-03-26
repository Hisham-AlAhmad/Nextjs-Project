import PublicLayout from '@/components/public/PublicLayout'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from '@/styles/public/services.module.css'

export const metadata = {
  title: 'Services — Arcline Studio',
  description: 'Discover the full range of architectural and design services Arcline offers.',
}

async function getData() {
  try {
    const content = await prisma.pageContent.findUnique({
      where: { page_section: { page: 'services', section: 'list' } }
    })
    return { services: Array.isArray(content?.content) ? content.content : [] }
  } catch {
    return { services: [] }
  }
}

const defaultServices = [
  { title: 'Residential Architecture', description: 'Private homes and villas designed around the way you live — from concept to completion.', icon: '⌂' },
  { title: 'Commercial Architecture', description: 'Office buildings, retail spaces, and mixed-use developments that balance function with identity.', icon: '▣' },
  { title: 'Interior Architecture', description: 'Spatial design that considers materials, light, and movement to create cohesive environments.', icon: '◫' },
  { title: 'Hospitality Design', description: 'Hotels, restaurants, and resorts designed to create memorable experiences for guests.', icon: '◈' },
  { title: 'Urban Planning', description: 'Master planning and urban design that shapes how communities grow and move.', icon: '⊞' },
  { title: 'Renovation & Adaptive Reuse', description: 'Breathing new life into existing structures while respecting their history and character.', icon: '↺' },
]

export default async function ServicesPage() {
  const { services } = await getData()
  const list = services.length > 0 ? services : defaultServices

  return (
    <PublicLayout>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Our Services</h1>
          <p className={styles.heroSub}>A full spectrum of architectural and design expertise.</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <div className={styles.grid}>
            {list.map((service, i) => (
              <div key={i} className={styles.card}>
                {service.icon && <span className={styles.icon}>{service.icon}</span>}
                <h2 className={styles.cardTitle}>{service.title}</h2>
                <p className={styles.cardBody}>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>Ready to Start Your Project?</h2>
          <p className={styles.ctaBody}>Tell us about your vision. We would love to hear from you.</p>
          <Link href="/contact" className={styles.ctaBtn}>Get In Touch</Link>
        </div>
      </section>
    </PublicLayout>
  )
}
