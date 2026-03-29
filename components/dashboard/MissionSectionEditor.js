'use client'

import { useState } from 'react'
import styles from '@/styles/dashboard/form.module.css'
import editorStyles from '@/styles/dashboard/pageEditor.module.css'

export default function MissionSectionEditor({ page, section, label, hint, initialContent }) {
  const initial = initialContent ? JSON.parse(initialContent) : { heading: '', text: '' }

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
          placeholder="Section heading"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Mission Text</label>
        <textarea
          name="text"
          value={form.text}
          onChange={handleChange}
          className={styles.textarea}
          rows={6}
          placeholder="Describe your mission and values..."
        />
      </div>

      <div className={editorStyles.previewBlock}>
        <p className={editorStyles.previewTitle}>Live Preview</p>
        <div className={editorStyles.previewText}>
          <h4>{form.heading || 'Mission Heading'}</h4>
          <p>{form.text || 'Mission body preview...'}</p>
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
