'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/dashboard/list.module.css'
import subStyles from '@/styles/dashboard/submissions.module.css'

export default function SubmissionRow({ submission, type }) {
  const router = useRouter()
  const [read, setRead] = useState(submission.read)
  const [loading, setLoading] = useState(false)
  const endpoint = type === 'contact' ? '/api/contact' : '/api/inquiries'

  async function toggleRead() {
    setLoading(true)
    const res = await fetch(`${endpoint}/${submission.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: !read }),
    })
    if (res.ok) setRead(!read)
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this submission?')) return
    setLoading(true)
    await fetch(`${endpoint}/${submission.id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <tr className={read ? '' : subStyles.unreadRow}>
      <td>
        <div className={subStyles.sender}>
          <span className={subStyles.name}>{submission.name}</span>
          <span className={subStyles.email}>{submission.email}</span>
        </div>
      </td>
      {type === 'contact' && <td>{submission.projectType || '—'}</td>}
      {type === 'inquiry' && <td>{submission.project?.title || '—'}</td>}
      <td className={subStyles.message}>{submission.message}</td>
      <td>{new Date(submission.createdAt).toLocaleDateString()}</td>
      <td>
        <div className={styles.rowActions}>
          <button
            className={read ? styles.btnEdit : subStyles.btnMarkRead}
            onClick={toggleRead}
            disabled={loading}
          >
            {read ? 'Mark unread' : 'Mark read'}
          </button>
          <button className={styles.btnDelete} onClick={handleDelete} disabled={loading}>
            Delete
          </button>
        </div>
      </td>
    </tr>
  )
}
