'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/dashboard/submissionRow.module.css'

export function SubmissionRow({ submission, type, isAdmin }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [expanded, setExpanded] = useState(false)
  const [read, setRead] = useState(submission.read)
  const [deleted, setDeleted] = useState(false)
  const [error, setError] = useState('')

  const endpoint = type === 'contact' ? `/api/contact/${submission.id}` : `/api/inquiries/${submission.id}`

  async function toggleRead() {
    setError('')
    const next = !read
    setRead(next) // optimistic update
    try {
      const res = await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: next }),
      })
      if (!res.ok) {
        setRead(!next) // revert
        setError('Failed to update')
      } else {
        startTransition(() => router.refresh())
      }
    } catch {
      setRead(!next)
      setError('Network error')
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this submission? This cannot be undone.')) return
    setError('')
    try {
      const res = await fetch(endpoint, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to delete')
        return
      }
      setDeleted(true)
      startTransition(() => router.refresh())
    } catch {
      setError('Network error')
    }
  }

  if (deleted) return null

  const msgPreview = submission.message.length > 100
    ? submission.message.slice(0, 100) + '…'
    : submission.message

  return (
    <tr className={!read ? styles.unreadRow : styles.row}>
      <td className={styles.tdBold}>{submission.name}</td>
      <td>
        <a href={`mailto:${submission.email}`} className={styles.emailLink}>{submission.email}</a>
      </td>
      {type === 'contact' && (
        <td className={styles.tdMuted}>{submission.projectType || '—'}</td>
      )}
      {type === 'inquiry' && (
        <td className={styles.tdMuted}>{submission.project?.title || '—'}</td>
      )}
      <td className={styles.tdDate}>{new Date(submission.createdAt).toLocaleDateString()}</td>
      <td className={styles.tdMessage}>
        <div className={styles.messageText}>
          {expanded ? submission.message : msgPreview}
        </div>
        {submission.message.length > 100 && (
          <button
            type="button"
            className={styles.expandBtn}
            onClick={() => setExpanded(prev => !prev)}
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </td>
      <td className={styles.tdActions}>
        <div className={styles.actionGroup}>
          <button
            type="button"
            onClick={toggleRead}
            disabled={isPending}
            className={read ? styles.markUnreadBtn : styles.markReadBtn}
            title={read ? 'Mark as unread' : 'Mark as read'}
          >
            {read ? 'Unread' : 'Read ✓'}
          </button>
          {isAdmin && (
            <button
              type="button"
              onClick={handleDelete}
              className={styles.deleteBtn}
              title="Delete submission"
            >
              ✕
            </button>
          )}
        </div>
        {error && <p className={styles.rowError}>{error}</p>}
      </td>
    </tr>
  )
}
