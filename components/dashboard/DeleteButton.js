'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/dashboard/list.module.css'

export default function DeleteButton({ id, endpoint, onDeleted }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this item?')) return
    setLoading(true)
    try {
      await fetch(`${endpoint}/${id}`, { method: 'DELETE' })
      if (onDeleted) {
        onDeleted(id)
      } else {
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      className={styles.btnDelete}
      onClick={handleDelete}
      disabled={loading}
    >
      {loading ? '…' : 'Delete'}
    </button>
  )
}
