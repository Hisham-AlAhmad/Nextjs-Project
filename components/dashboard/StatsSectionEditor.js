'use client'

import { useState } from 'react'
import styles from '@/styles/dashboard/form.module.css'
import editorStyles from '@/styles/dashboard/pageEditor.module.css'

export default function StatsSectionEditor({ page, section, label, hint, initialContent }) {
  const initial = initialContent ? JSON.parse(initialContent) : { projects: '0', years: '0', awards: '0', countries: '0' }

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

      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label}>Projects</label>
          <input
            type="text"
            name="projects"
            value={form.projects}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., 150"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Years</label>
          <input
            type="text"
            name="years"
            value={form.years}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., 20"
          />
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label}>Awards</label>
          <input
            type="text"
            name="awards"
            value={form.awards}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., 45"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Countries</label>
          <input
            type="text"
            name="countries"
            value={form.countries}
            onChange={handleChange}
            className={styles.input}
            placeholder="e.g., 25"
          />
        </div>
      </div>

      <div className={editorStyles.previewBlock}>
        <p className={editorStyles.previewTitle}>Live Preview</p>
        <div className={editorStyles.previewStats}>
          <div><strong>{form.projects || '0'}</strong><span>Projects</span></div>
          <div><strong>{form.years || '0'}</strong><span>Years</span></div>
          <div><strong>{form.awards || '0'}</strong><span>Awards</span></div>
          <div><strong>{form.countries || '0'}</strong><span>Countries</span></div>
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
