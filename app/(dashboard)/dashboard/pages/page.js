import prisma from '@/lib/prisma'
import PagesEditor from '@/components/dashboard/PagesEditor'
import styles from '@/styles/dashboard/pages.module.css'

export const metadata = { title: 'Pages — Arcline Dashboard' }

export default async function PagesPage() {
  const sections = await prisma.pageContent.findMany({
    orderBy: [{ page: 'asc' }, { section: 'asc' }],
  })

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Pages</h1>
        <p className={styles.sub}>
          Edit the content of your Home, About and Services pages.
          Changes save instantly — no redeploy needed.
        </p>
      </div>
      <PagesEditor sections={sections} />
    </div>
  )
}
