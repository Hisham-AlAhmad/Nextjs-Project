'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { ConfirmDelete } from './ConfirmDelete'
import { ImageUploadButton } from './ImageUploadButton'
import styles from '@/styles/dashboard/form.module.css'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false })

export default function ProjectForm({ project }) {
  const router = useRouter()
  const isEdit = Boolean(project)

  const [form, setForm] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    excerpt: project?.excerpt || '',
    description: project?.description || '',
    category: project?.category || '',
    images: Array.isArray(project?.images) ? project.images.filter(Boolean) : [],
    published: project?.published ?? false,
  })
  const [imageUrlInput, setImageUrlInput] = useState('')
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
    setSaving(true)

    try {
      const url = isEdit ? `/api/projects/${project.id}` : '/api/projects'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }

      router.push('/dashboard/projects')
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
      const res = await fetch(`/api/projects/${project.id}`, { method: 'DELETE' })
      if (!res.ok) {
        setError('Failed to delete')
        return
      }
      router.push('/dashboard/projects')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  function addImage(url) {
    const trimmed = (url || '').trim()
    if (!trimmed) return
    setForm(f => {
      if (f.images.includes(trimmed)) return f
      return { ...f, images: [...f.images, trimmed] }
    })
    setImageUrlInput('')
  }

  function removeImage(index) {
    setForm(f => ({
      ...f,
      images: f.images.filter((_, i) => i !== index),
    }))
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label}>Title *</label>
          <input name="title" value={form.title} onChange={handleTitleChange} className={styles.input} required placeholder="Villa Nour" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Slug *</label>
          <input name="slug" value={form.slug} onChange={handleChange} className={styles.input} required placeholder="villa-nour" />
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label}>Category *</label>
          <input name="category" value={form.category} onChange={handleChange} className={styles.input} required placeholder="Residential" />
        </div>
        <div className={styles.fieldCheck}>
          <label className={styles.checkLabel}>
            <input name="published" type="checkbox" checked={form.published} onChange={handleChange} className={styles.checkbox} />
            Published
          </label>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Excerpt *</label>
        <textarea name="excerpt" value={form.excerpt} onChange={handleChange} className={styles.textarea} rows={2} required placeholder="Short description for listing cards..." />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description *</label>
        <RichTextEditor
          value={form.description}
          onChange={html => setForm(f => ({ ...f, description: html }))}
          placeholder="Describe this project…"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Project Images</label>
        <p className={styles.helperText}>Upload files directly or add an external image URL. First image is used as the cover.</p>

        <ImageUploadButton onImageUrl={addImage} loading={saving} />

        <div className={styles.inlineRow}>
          <input
            value={imageUrlInput}
            onChange={e => setImageUrlInput(e.target.value)}
            className={styles.input}
            placeholder="https://example.com/image.jpg"
          />
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => addImage(imageUrlInput)}
          >
            Add URL
          </button>
        </div>

        {form.images.length > 0 && (
          <div className={styles.imageGrid}>
            {form.images.map((url, index) => (
              <div className={styles.imageItem} key={`${url}-${index}`}>
                <img src={url} alt={`Project image ${index + 1}`} className={styles.imagePreview} />
                <div className={styles.imageMeta}>
                  <span className={styles.imageLabel}>{index === 0 ? 'Cover' : `Image ${index + 1}`}</span>
                  <button type="button" className={styles.removeImageBtn} onClick={() => removeImage(index)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
        </button>
        {isEdit && (
          <button type="button" onClick={() => setShowDeleteModal(true)} className={styles.deleteBtn} disabled={deleting}>
            Delete
          </button>
        )}
      </div>

      <ConfirmDelete
        isOpen={showDeleteModal}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete Project"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteModal(false)}
        isLoading={deleting}
      />
    </form>
  )
}
