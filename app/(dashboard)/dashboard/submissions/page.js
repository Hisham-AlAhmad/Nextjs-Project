import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { SubmissionRow } from '@/components/dashboard/SubmissionRow'
import styles from '@/styles/dashboard/submissions.module.css'

export const metadata = { title: 'Submissions — Arcline Dashboard' }

function serializeContact(c) {
  return {
    id: c.id,
    name: c.name,
    email: c.email,
    projectType: c.projectType ?? null,
    message: c.message,
    read: c.read,
    createdAt: c.createdAt.toISOString(),
  }
}

function serializeInquiry(i) {
  return {
    id: i.id,
    name: i.name,
    email: i.email,
    message: i.message,
    read: i.read,
    createdAt: i.createdAt.toISOString(),
    project: i.project ? { title: i.project.title, slug: i.project.slug } : null,
  }
}

export default async function SubmissionsPage() {
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user?.role === 'ADMIN'

  let contacts = []
  let inquiries = []

  try {
    ;[contacts, inquiries] = await Promise.all([
      prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } }),
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
            {unreadContacts > 0 && (
              <span className={styles.unreadBadge}>{unreadContacts} unread</span>
            )}
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
                  <th>Date</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map(c => (
                  <SubmissionRow
                    key={c.id}
                    submission={serializeContact(c)}
                    type="contact"
                    isAdmin={isAdmin}
                  />
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
            {unreadInquiries > 0 && (
              <span className={styles.unreadBadge}>{unreadInquiries} unread</span>
            )}
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
                  <th>Date</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map(i => (
                  <SubmissionRow
                    key={i.id}
                    submission={serializeInquiry(i)}
                    type="inquiry"
                    isAdmin={isAdmin}
                  />
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}
