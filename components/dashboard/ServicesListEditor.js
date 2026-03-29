'use client'

import { useState } from 'react'
import styles from '@/styles/dashboard/form.module.css'
import editorStyles from '@/styles/dashboard/pageEditor.module.css'

export default function ServicesListEditor({ page, section, label, hint, initialContent }) {
  const initial = initialContent ? JSON.parse(initialContent) : [{ title: '', description: '', icon: '' }]

  const [services, setServices] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  function addService() {
    setServices(s => [...s, { title: '', description: '', icon: '' }])
    setStatus(null)
  }

  function updateService(idx, field, value) {
    setServices(s => {
      const updated = [...s]
      updated[idx] = { ...updated[idx], [field]: value }
      return updated
    })
    setStatus(null)
  }

  function removeService(idx) {
    setServices(s => s.filter((_, i) => i !== idx))
    setStatus(null)
  }

  async function handleSave() {
    setSaving(true)
    setStatus(null)

    try {
      const res = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, section, content: services }),
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

      <div className={editorStyles.arrayList}>
        {services.map((service, idx) => (
          <div key={idx} className={editorStyles.arrayItem}>
            <div className={editorStyles.arrayHeader}>
              <h4 className={editorStyles.arrayTitle}>Service {idx + 1}</h4>
              <button type="button" onClick={() => removeService(idx)} className={editorStyles.removeBtn}>
                Remove
              </button>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Title</label>
              <input type="text" value={service.title} onChange={e => updateService(idx, 'title', e.target.value)} className={styles.input} placeholder="Service title" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Description</label>
              <textarea value={service.description} onChange={e => updateService(idx, 'description', e.target.value)} className={styles.textarea} rows={3} placeholder="Service description..." />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Icon (emoji or URL)</label>
              <input type="text" value={service.icon} onChange={e => updateService(idx, 'icon', e.target.value)} className={styles.input} placeholder="🏗️ or https://example.com/icon.png" />
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addService} className={editorStyles.addBtn}>
        + Add Service
      </button>

      <div className={editorStyles.previewBlock}>
        <p className={editorStyles.previewTitle}>Live Preview</p>
        <div className={editorStyles.previewCards}>
          {services.map((service, idx) => (
            <div className={editorStyles.previewCard} key={`service-preview-${idx}`}>
              <span className={editorStyles.previewIcon}>{service.icon || '⌂'}</span>
              <h5>{service.title || 'Service title'}</h5>
              <p>{service.description || 'Service description preview...'}</p>
            </div>
          ))}
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
