'use client'

import { useState } from 'react'
import styles from '@/styles/dashboard/form.module.css'
import editorStyles from '@/styles/dashboard/pageEditor.module.css'

export default function HeroSectionEditor({ page, section, label, hint, initialContent }) {
  const initial = initialContent ? JSON.parse(initialContent) : { heading: '', subheading: '', ctaText: '' }

  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    setStatus(null)
  }

  async function handleSave() {
    setSaving(true)
    setStatus(null)

    try {
      const res = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, section, content: form }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMsg('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className={editorStyles.block}>
      <div className={editorStyles.blockHeader}>
        <div>
          <h3 className={editorStyles.blockLabel}>{label}</h3>
          <p className={editorStyles.blockHint}>{hint}</p>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Heading</label>
        <input
          type="text"
          name="heading"
          value={form.heading}
          onChange={handleChange}
          className={styles.input}
          placeholder="Main heading text"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Subheading</label>
        <textarea
          name="subheading"
          value={form.subheading}
          onChange={handleChange}
          className={styles.textarea}
          rows={2}
          placeholder="Supporting text or subtitle"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>CTA Button Text</label>
        <input
          type="text"
          name="ctaText"
          value={form.ctaText}
          onChange={handleChange}
          className={styles.input}
          placeholder="e.g., Start Your Project"
        />
      </div>

      <div className={editorStyles.previewBlock}>
        <p className={editorStyles.previewTitle}>Live Preview</p>
        <div className={editorStyles.previewHero}>
          <h4>{form.heading || 'Heading preview'}</h4>
          <p>{form.subheading || 'Subheading preview...'}</p>
          <button type="button">{form.ctaText || 'CTA Text'}</button>
        </div>
      </div>

      {status === 'success' && <p className={editorStyles.successMsg}>Saved successfully.</p>}
      {status === 'error' && <p className={editorStyles.errorMsg}>{errorMsg}</p>}

      <button onClick={handleSave} className={editorStyles.saveBtn} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}
