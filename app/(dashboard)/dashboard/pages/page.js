import prisma from '@/lib/prisma'
import HeroSectionEditor from '@/components/dashboard/HeroSectionEditor'
import StatsSectionEditor from '@/components/dashboard/StatsSectionEditor'
import MissionSectionEditor from '@/components/dashboard/MissionSectionEditor'
import TeamSectionEditor from '@/components/dashboard/TeamSectionEditor'
import ServicesListEditor from '@/components/dashboard/ServicesListEditor'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'Pages — Arcline Dashboard' }

const SECTIONS = [
  { page: 'home', section: 'hero', label: 'Home — Hero', hint: 'Main hero section with heading, subheading, and CTA', component: HeroSectionEditor },
  { page: 'home', section: 'stats', label: 'Home — Stats', hint: 'Display key statistics: projects, years, awards, countries', component: StatsSectionEditor },
  { page: 'about', section: 'mission', label: 'About — Mission', hint: 'Company mission statement and values', component: MissionSectionEditor },
  { page: 'about', section: 'team', label: 'About — Team', hint: 'List of team members with roles and photos', component: TeamSectionEditor },
  { page: 'services', section: 'list', label: 'Services — List', hint: 'List of services offered by the company', component: ServicesListEditor },
]

export default async function PagesPage() {
  let contentMap = {}
  try {
    const rows = await prisma.pageContent.findMany()
    for (const row of rows) {
      contentMap[`${row.page}_${row.section}`] = row
    }
  } catch {}

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Pages</h1>
          <p className={styles.sub}>Edit website page content without redeploying</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '960px' }}>
        {SECTIONS.map(s => {
          const existing = contentMap[`${s.page}_${s.section}`]
          const EditorComponent = s.component
          return (
            <EditorComponent
              key={`${s.page}_${s.section}`}
              page={s.page}
              section={s.section}
              label={s.label}
              hint={s.hint}
              initialContent={existing ? JSON.stringify(existing.content, null, 2) : ''}
            />
          )
        })}
      </div>
    </div>
  )
}

