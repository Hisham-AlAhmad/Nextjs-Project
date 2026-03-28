'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import styles from '@/styles/dashboard/form.module.css'

/**
 * Allows uploading images to /public/uploads/ via the /api/upload endpoint.
 * Calls onChange(urls: string[]) whenever the list changes.
 */
export default function ImageUpload({ value = [], onChange }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    setError('')
    setUploading(true)
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const fd = new FormData()
          fd.append('file', file)
          const res = await fetch('/api/upload', { method: 'POST', body: fd })
          if (!res.ok) {
            const data = await res.json()
            throw new Error(data.error || 'Upload failed')
          }
          const data = await res.json()
          return data.url
        })
      )
      onChange([...value, ...urls])
    } catch (err) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  function removeImage(url) {
    onChange(value.filter((u) => u !== url))
  }

  return (
    <div>
      {error && <p className={styles.errorMsg}>{error}</p>}

      <div className={styles.imageList}>
        {value.map((url) => (
          <div key={url} className={styles.imageItem}>
            <Image src={url} alt="upload" fill sizes="120px" className={styles.imageThumb} style={{ objectFit: 'cover' }} />
            <button
              type="button"
              className={styles.imageRemove}
              onClick={() => removeImage(url)}
              title="Remove"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        style={{ display: 'none' }}
        onChange={handleFiles}
      />
      <button
        type="button"
        className={`${styles.uploadBtn} ${uploading ? styles.uploadBtnDisabled : ''}`}
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{ marginTop: value.length > 0 ? 10 : 0 }}
      >
        {uploading ? 'Uploading…' : '+ Add images'}
      </button>
    </div>
  )
}
