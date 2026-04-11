'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/dashboard/crudList.module.css'

export default function DeleteRowButton({ endpoint, label = 'Delete' }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        if (!confirm('Delete this item? This cannot be undone.')) return

        setLoading(true)
        try {
            const res = await fetch(endpoint, { method: 'DELETE' })
            if (!res.ok) {
                const data = await res.json().catch(() => ({}))
                alert(data.error || 'Failed to delete item')
                return
            }
            router.refresh()
        } catch {
            alert('Network error while deleting')
        } finally {
            setLoading(false)
        }
    }

    return (
        <button type="button" onClick={handleDelete} className={styles.deleteLink} disabled={loading}>
            {loading ? 'Deleting...' : label}
        </button>
    )
}
