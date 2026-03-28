import prisma from '@/lib/prisma'
import styles from '@/styles/dashboard/list.module.css'
import subStyles from '@/styles/dashboard/submissions.module.css'
import SubmissionRow from '@/components/dashboard/SubmissionRow'
import SubmissionTabs from '@/components/dashboard/SubmissionTabs'

export const metadata = { title: 'Submissions — Arcline Dashboard' }

export default async function SubmissionsPage({ searchParams }) {
  const { tab = 'contact' } = await searchParams

  const [contacts, inquiries] = await Promise.all([
    prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.projectInquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: { project: { select: { title: true } } },
    }),
  ])

  const unreadContacts = contacts.filter(c => !c.read).length
  const unreadInquiries = inquiries.filter(i => !i.read).length

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Submissions</h1>
          <p className={styles.sub}>Contact forms and project inquiry messages</p>
        </div>
      </div>

      <SubmissionTabs
        activeTab={tab}
        unreadContacts={unreadContacts}
        unreadInquiries={unreadInquiries}
      />

      {tab === 'contact' && (
        <div className={styles.tableCard}>
          {contacts.length === 0 ? (
            <p className={styles.empty}>No contact submissions yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>From</th>
                  <th>Project Type</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(s => (
                  <SubmissionRow key={s.id} submission={s} type="contact" />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'inquiries' && (
        <div className={styles.tableCard}>
          {inquiries.length === 0 ? (
            <p className={styles.empty}>No project inquiries yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>From</th>
                  <th>Project</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map(s => (
                  <SubmissionRow key={s.id} submission={s} type="inquiry" />
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
