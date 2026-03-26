'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '@/styles/dashboard/form.module.css'

export default function ProjectForm({ project }) {
  const router = useRouter()
  const isEdit = Boolean(project)

  const [form, setForm] = useState({
    title: project?.title || '',
    slug: project?.slug || '',
    excerpt: project?.excerpt || '',
    description: project?.description || '',
    category: project?.category || '',
    published: project?.published ?? false,
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

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
    if (!confirm('Delete this project? This cannot be undone.')) return
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
    }
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
        <textarea name="description" value={form.description} onChange={handleChange} className={styles.textarea} rows={10} required placeholder="Full project description (HTML supported)..." />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Project'}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className={styles.deleteBtn} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        )}
      </div>
    </form>
  )
}
