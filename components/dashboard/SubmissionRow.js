'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'
import { ConfirmDelete } from './ConfirmDelete'
import styles from '@/styles/dashboard/submissionRow.module.css'

export function SubmissionRow({ submission, type, isAdmin }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [expanded, setExpanded] = useState(false)
  const [read, setRead] = useState(submission.read)
  const [deleted, setDeleted] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

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
    } finally {
      setShowDeleteModal(false)
    }
  }

  if (deleted) return null

  const msgPreview = submission.message.length > 100
    ? submission.message.slice(0, 100) + '…'
    : submission.message

  return (
    <>
      <tr
        className={!read ? styles.unreadRow : styles.row}
        onClick={() => setShowDetails(true)}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setShowDetails(true)
          }
        }}
        aria-label={`Open submission from ${submission.name}`}
      >
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
        <td>
          <span className={read ? styles.statusRead : styles.statusUnread}>
            {read ? 'Read' : 'Unread'}
          </span>
        </td>
        <td className={styles.tdMessage}>
          <div className={styles.messageText}>
            {expanded ? submission.message : msgPreview}
          </div>
          {submission.message.length > 100 && (
            <button
              type="button"
              className={styles.expandBtn}
              onClick={e => {
                e.stopPropagation()
                setExpanded(prev => !prev)
              }}
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </td>
        <td className={styles.tdActions}>
          <div className={styles.actionGroup}>
            <button
              type="button"
              onClick={e => {
                e.stopPropagation()
                toggleRead()
              }}
              disabled={isPending}
              className={read ? styles.markUnreadBtn : styles.markReadBtn}
              title={read ? 'Mark as unread' : 'Mark as read'}
            >
              {read ? 'Unread' : 'Read ✓'}
            </button>
            {isAdmin && (
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation()
                  setShowDeleteModal(true)
                }}
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

      <ConfirmDelete
        isOpen={showDeleteModal}
        title="Delete Submission"
        message="Are you sure you want to delete this submission? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={false}
      />

      {showDetails && typeof document !== 'undefined' && createPortal(
        <div className={styles.detailsOverlay} onClick={() => setShowDetails(false)}>
          <div className={styles.detailsModal} onClick={e => e.stopPropagation()}>
            <div className={styles.detailsHeader}>
              <h3>{submission.name}</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setShowDetails(false)}>✕</button>
            </div>

            <div className={styles.detailsMeta}>
              <p><strong>Email:</strong> <a href={`mailto:${submission.email}`} className={styles.emailLink}>{submission.email}</a></p>
              {type === 'contact' && <p><strong>Type:</strong> {submission.projectType || '—'}</p>}
              {type === 'inquiry' && <p><strong>Project:</strong> {submission.project?.title || '—'}</p>}
              <p><strong>Date:</strong> {new Date(submission.createdAt).toLocaleString()}</p>
              <p><strong>Status:</strong> <span className={read ? styles.statusRead : styles.statusUnread}>{read ? 'Read' : 'Unread'}</span></p>
            </div>

            <div className={styles.detailsBody}>
              {submission.message}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
