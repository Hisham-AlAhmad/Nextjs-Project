'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { hasTextContent, toPlainText } from '@/lib/richTextUtils'
import { ConfirmDelete } from './ConfirmDelete'
import { ImageUploadButton } from './ImageUploadButton'
import styles from '@/styles/dashboard/form.module.css'

export default function NewsForm({ post }) {
  const router = useRouter()
  const isEdit = Boolean(post)

  const [form, setForm] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: toPlainText(post?.content || ''),
    coverImage: post?.coverImage || '',
    published: post?.published ?? false,
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }))
  }

  function autoSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function handleTitleChange(e) {
    const title = e.target.value
    setForm(f => ({ ...f, title, slug: isEdit ? f.slug : autoSlug(title) }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!hasTextContent(form.content)) { setError('Content is required'); return }

    setSaving(true)

    try {
      const url = isEdit ? `/api/news/${post.id}` : '/api/news'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, content: toPlainText(form.content) }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }

      router.push('/dashboard/news')
      router.refresh()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setDeleting(true)

    try {
      const res = await fetch(`/api/news/${post.id}`, { method: 'DELETE' })
      if (!res.ok) { setError('Failed to delete'); return }
      router.push('/dashboard/news')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label}>Title *</label>
          <input name="title" value={form.title} onChange={handleTitleChange} className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Slug *</label>
          <input name="slug" value={form.slug} onChange={handleChange} className={styles.input} required />
        </div>
      </div>

      <div className={styles.fieldCheck}>
        <label className={styles.checkLabel}>
          <input name="published" type="checkbox" checked={form.published} onChange={handleChange} className={styles.checkbox} />
          Published
        </label>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Excerpt *</label>
        <textarea name="excerpt" value={form.excerpt} onChange={handleChange} className={styles.textarea} rows={2} required />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Cover Image</label>
        <p className={styles.helperText}>Upload an image or paste an image URL for news cards and post header.</p>
        <ImageUploadButton onImageUrl={url => setForm(f => ({ ...f, coverImage: url }))} loading={saving} />
        <input
          name="coverImage"
          value={form.coverImage}
          onChange={handleChange}
          className={styles.input}
          placeholder="https://example.com/news-cover.jpg"
        />
        {form.coverImage && (
          <img src={form.coverImage} alt="News cover preview" className={styles.imagePreview} style={{ maxWidth: '260px', borderRadius: '10px' }} />
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Content *</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          className={styles.textarea}
          rows={10}
          required
          placeholder="Write your news post..."
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Post'}
        </button>
        {isEdit && (
          <button type="button" onClick={() => setShowDeleteModal(true)} className={styles.deleteBtn} disabled={deleting}>
            Delete
          </button>
        )}
      </div>

      <ConfirmDelete
        isOpen={showDeleteModal}
        title="Delete News Post"
        message="Are you sure you want to delete this news post? This action cannot be undone."
        confirmText="Delete Post"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={deleting}
      />
    </form>
  )
}
