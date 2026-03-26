import PublicLayout from '@/components/public/PublicLayout'
import Image from 'next/image'
import prisma from '@/lib/prisma'
import styles from '@/styles/public/about.module.css'

export const metadata = {
  title: 'About — Arcline Studio',
  description: 'Learn about Arcline, our mission, and our team.',
}

async function getData() {
  try {
    const [missionContent, teamContent] = await Promise.all([
      prisma.pageContent.findUnique({ where: { page_section: { page: 'about', section: 'mission' } } }),
      prisma.pageContent.findUnique({ where: { page_section: { page: 'about', section: 'team' } } }),
    ])
    return { missionContent, teamContent }
  } catch {
    return { missionContent: null, teamContent: null }
  }
}

export default async function AboutPage() {
  const { missionContent, teamContent } = await getData()

  const mission = missionContent?.content || {
    heading: 'Our Mission',
    text: "We believe architecture is the most direct expression of human values. At Arcline, we craft spaces that honour the relationship between people, light, and material — buildings that don't just stand but speak.",
  }

  const team = Array.isArray(teamContent?.content) ? teamContent.content : [
    { name: 'Sara Al-Rashid', role: 'Founder & Principal Architect', image: '' },
    { name: 'Omar Nasser', role: 'Lead Designer', image: '' },
    { name: 'Lara Khouri', role: 'Interior Architecture', image: '' },
    { name: 'Karim Haddad', role: 'Project Manager', image: '' },
  ]

  return (
    <PublicLayout>
      {/* Page Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>About the Studio</h1>
          <p className={styles.heroSub}>Architecture + perfect lines, since 2009.</p>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.section}>
        <div className={styles.missionInner}>
          <h2 className={styles.missionHeading}>{mission.heading}</h2>
          <p className={styles.missionText}>{mission.text}</p>
        </div>
      </section>

      {/* Values */}
      <section className={styles.values}>
        <div className={styles.valuesInner}>
          {[
            { label: 'Precision', body: 'Every line has a reason. We obsess over detail because the details compose the whole.' },
            { label: 'Restraint', body: "We subtract until only the essential remains — then we refine what's left." },
            { label: 'Context', body: 'Good architecture listens to its place: the light, the landscape, the culture.' },
          ].map(v => (
            <div key={v.label} className={styles.valueCard}>
              <h3 className={styles.valueLabel}>{v.label}</h3>
              <p className={styles.valueBody}>{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section className={styles.section}>
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>The Team</h2>
          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <div key={i} className={styles.memberCard}>
                <div className={styles.memberImage}>
                  {member.image && <Image src={member.image} alt={member.name} fill className={styles.img} />}
                </div>
                <h3 className={styles.memberName}>{member.name}</h3>
                <p className={styles.memberRole}>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
