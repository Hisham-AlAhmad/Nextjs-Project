import prisma from '@/lib/prisma'
import PageEditor from '@/components/dashboard/PageEditor'
import styles from '@/styles/dashboard/crudList.module.css'

export const metadata = { title: 'Pages — Arcline Dashboard' }

const SECTIONS = [
  { page: 'home', section: 'hero', label: 'Home — Hero', hint: 'JSON: { heading, subheading, ctaText }' },
  { page: 'home', section: 'stats', label: 'Home — Stats', hint: 'JSON: { projects, years, awards, countries }' },
  { page: 'about', section: 'mission', label: 'About — Mission', hint: 'JSON: { heading, text }' },
  { page: 'about', section: 'team', label: 'About — Team', hint: 'JSON array: [{ name, role, image }]' },
  { page: 'services', section: 'list', label: 'Services — List', hint: 'JSON array: [{ title, description, icon }]' },
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
          return (
            <PageEditor
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
