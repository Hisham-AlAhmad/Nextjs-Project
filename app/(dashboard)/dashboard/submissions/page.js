import Link from 'next/link'
import prisma from '@/lib/prisma'
import styles from '@/styles/dashboard/submissions.module.css'

export const metadata = { title: 'Submissions — Arcline Dashboard' }

export default async function SubmissionsPage() {
  let contacts = []
  let inquiries = []

  try {
    [contacts, inquiries] = await Promise.all([
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
      }),
      prisma.projectInquiry.findMany({
        orderBy: { createdAt: 'desc' },
        include: { project: { select: { title: true, slug: true } } },
      }),
    ])
  } catch {}

  const unreadContacts = contacts.filter(c => !c.read).length
  const unreadInquiries = inquiries.filter(i => !i.read).length

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Submissions</h1>
        <p className={styles.sub}>Contact forms and project inquiries</p>
      </div>

      {/* Contact Submissions */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Contact
            {unreadContacts > 0 && <span className={styles.unreadBadge}>{unreadContacts} unread</span>}
          </h2>
        </div>

        <div className={styles.card}>
          {contacts.length === 0 ? (
            <p className={styles.empty}>No contact submissions yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => (
                  <tr key={c.id} className={!c.read ? styles.unreadRow : ''}>
                    <td className={styles.tdBold}>{c.name}</td>
                    <td><a href={`mailto:${c.email}`} className={styles.emailLink}>{c.email}</a></td>
                    <td className={styles.tdMuted}>{c.projectType || '—'}</td>
                    <td>
                      <span className={`${styles.badge} ${!c.read ? styles.badgeUnread : styles.badgeRead}`}>
                        {c.read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className={styles.tdMuted}>{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className={styles.tdMessage}>{c.message.slice(0, 80)}{c.message.length > 80 ? '...' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* Project Inquiries */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Project Inquiries
            {unreadInquiries > 0 && <span className={styles.unreadBadge}>{unreadInquiries} unread</span>}
          </h2>
        </div>

        <div className={styles.card}>
          {inquiries.length === 0 ? (
            <p className={styles.empty}>No project inquiries yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Project</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map(i => (
                  <tr key={i.id} className={!i.read ? styles.unreadRow : ''}>
                    <td className={styles.tdBold}>{i.name}</td>
                    <td><a href={`mailto:${i.email}`} className={styles.emailLink}>{i.email}</a></td>
                    <td className={styles.tdMuted}>{i.project?.title || '—'}</td>
                    <td>
                      <span className={`${styles.badge} ${!i.read ? styles.badgeUnread : styles.badgeRead}`}>
                        {i.read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className={styles.tdMuted}>{new Date(i.createdAt).toLocaleDateString()}</td>
                    <td className={styles.tdMessage}>{i.message.slice(0, 80)}{i.message.length > 80 ? '...' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}
