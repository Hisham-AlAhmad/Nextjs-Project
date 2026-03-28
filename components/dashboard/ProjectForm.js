'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import styles from '@/styles/dashboard/form.module.css'
import ImageUpload from '@/components/dashboard/ImageUpload'

const RichTextEditor = dynamic(() => import('@/components/dashboard/RichTextEditor'), { ssr: false })

const CATEGORIES = ['Residential', 'Commercial', 'Hospitality', 'Cultural', 'Office', 'Other']

export default function ProjectForm({ project }) {
  const router = useRouter()
  const isEdit = !!project

  const [title, setTitle] = useState(project?.title ?? '')
  const [excerpt, setExcerpt] = useState(project?.excerpt ?? '')
  const [description, setDescription] = useState(project?.description ?? '')
  const [category, setCategory] = useState(project?.category ?? '')
  const [images, setImages] = useState(
    Array.isArray(project?.images) ? project.images : []
  )
  // details is stored as key-value pairs: [{key, value}]
  const [details, setDetails] = useState(() => {
    const d = project?.details
    if (d && typeof d === 'object' && !Array.isArray(d)) {
      return Object.entries(d).map(([key, value]) => ({ key, value }))
    }
    return []
  })
  const [published, setPublished] = useState(project?.published ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function addDetail() {
    setDetails(prev => [...prev, { key: '', value: '' }])
  }

  function updateDetail(index, field, val) {
    setDetails(prev => prev.map((d, i) => i === index ? { ...d, [field]: val } : d))
  }

  function removeDetail(index) {
    setDetails(prev => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!title.trim() || !excerpt.trim() || !description.trim() || !category) {
      setError('Title, excerpt, description and category are required.')
      return
    }

    const detailsObj = {}
    for (const { key, value } of details) {
      if (key.trim()) detailsObj[key.trim()] = value.trim()
    }

    setSaving(true)
    try {
      const url = isEdit ? `/api/projects/${project.id}` : '/api/projects'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, description, category, images, details: detailsObj, published }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong.')
        return
      }
      setSuccess(isEdit ? 'Project updated.' : 'Project created.')
      if (!isEdit) {
        router.push('/dashboard/projects')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.errorMsg}>{error}</p>}
      {success && <p className={styles.successMsg}>{success}</p>}

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="title">Title</label>
          <input
            id="title"
            className={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Project title"
            required
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">Category</label>
          <select
            id="category"
            className={styles.select}
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category…</option>
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="excerpt">Excerpt</label>
        <textarea
          id="excerpt"
          className={styles.textarea}
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="Short preview shown on the projects listing page"
          rows={3}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <RichTextEditor value={description} onChange={setDescription} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Images</label>
        <ImageUpload value={images} onChange={setImages} />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Project Details</label>
        <p className={styles.tagsHint}>
          Key specs shown on the project page — e.g. Location, Area, Year
        </p>
        <div className={styles.detailsGrid}>
          {details.map((d, i) => (
            <div key={i} className={styles.detailRow}>
              <input
                className={styles.input}
                placeholder="Key (e.g. Location)"
                value={d.key}
                onChange={e => updateDetail(i, 'key', e.target.value)}
              />
              <input
                className={styles.input}
                placeholder="Value (e.g. Beirut)"
                value={d.value}
                onChange={e => updateDetail(i, 'value', e.target.value)}
              />
              <button type="button" className={styles.detailRemove} onClick={() => removeDetail(i)}>
                ×
              </button>
            </div>
          ))}
          <button type="button" className={styles.addBtn} onClick={addDetail}>
            + Add detail
          </button>
        </div>
      </div>

      <div className={styles.field}>
        <div className={styles.toggleRow}>
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
          />
          <label className={styles.toggleLabel} htmlFor="published">
            Published (visible on the website)
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.btnPrimary} disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Update Project' : 'Create Project'}
        </button>
        <Link href="/dashboard/projects" className={styles.btnSecondary}>
          Cancel
        </Link>
      </div>
    </form>
  )
}
