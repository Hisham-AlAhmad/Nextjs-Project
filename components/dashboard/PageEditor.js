'use client'

import { useState } from 'react'
import styles from '@/styles/dashboard/form.module.css'
import editorStyles from '@/styles/dashboard/pageEditor.module.css'

export default function PageEditor({ page, section, label, hint, initialContent }) {
  const [value, setValue] = useState(initialContent)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null) // null | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSave() {
    setSaving(true)
    setStatus(null)

    let parsed
    try {
      parsed = JSON.parse(value)
    } catch {
      setStatus('error')
      setErrorMsg('Invalid JSON. Please fix the syntax before saving.')
      setSaving(false)
      return
    }

    try {
      const res = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, section, content: parsed }),
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
      <textarea
        value={value}
        onChange={e => { setValue(e.target.value); setStatus(null) }}
        className={editorStyles.editor}
        rows={8}
        spellCheck={false}
        placeholder={hint}
      />
      {status === 'success' && <p className={editorStyles.successMsg}>Saved successfully.</p>}
      {status === 'error' && <p className={editorStyles.errorMsg}>{errorMsg}</p>}
      <button onClick={handleSave} className={editorStyles.saveBtn} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}
