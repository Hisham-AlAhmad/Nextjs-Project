'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from '@/styles/dashboard/confirmDelete.module.css'

export function ConfirmDelete({ isOpen, title, message, confirmText = 'Delete', onConfirm, onCancel, isLoading = false }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!isOpen) return null
  if (!mounted) return null

  return createPortal(
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
        </div>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button type="button" className={styles.cancelBtn} onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button type="button" className={styles.deleteBtn} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
