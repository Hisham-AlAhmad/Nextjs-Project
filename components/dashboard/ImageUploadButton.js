'use client'

import { useState, useRef } from 'react'
import styles from '@/styles/dashboard/imageUpload.module.css'

export function ImageUploadButton({ onImageUrl, loading = false }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState('')

  async function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setError('')
    setUploading(true)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result || '')
    }
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Upload failed')
        return
      }

      const data = await res.json()
      onImageUrl(data.url)
      setPreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.uploadContainer}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading || loading}
        className={styles.fileInput}
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading || loading}
        className={styles.uploadBtn}
      >
        {uploading ? 'Uploading...' : loading ? 'Loading...' : 'Upload Image'}
      </button>
      {preview && (
        <div className={styles.previewContainer}>
          <img src={preview} alt="Preview" className={styles.preview} />
        </div>
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  )
}
