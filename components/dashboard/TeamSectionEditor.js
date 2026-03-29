'use client'

import { useState } from 'react'
import styles from '@/styles/dashboard/form.module.css'
import editorStyles from '@/styles/dashboard/pageEditor.module.css'
import { ImageUploadButton } from './ImageUploadButton'

export default function TeamSectionEditor({ page, section, label, hint, initialContent }) {
  const initial = initialContent ? JSON.parse(initialContent) : [{ name: '', role: '', image: '' }]

  const [members, setMembers] = useState(initial)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  function addMember() {
    setMembers(m => [...m, { name: '', role: '', image: '' }])
    setStatus(null)
  }

  function updateMember(idx, field, value) {
    setMembers(m => {
      const updated = [...m]
      updated[idx] = { ...updated[idx], [field]: value }
      return updated
    })
    setStatus(null)
  }

  function removeMember(idx) {
    setMembers(m => m.filter((_, i) => i !== idx))
    setStatus(null)
  }

  async function handleSave() {
    setSaving(true)
    setStatus(null)

    try {
      const res = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, section, content: members }),
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
        {members.map((member, idx) => (
          <div key={idx} className={editorStyles.arrayItem}>
            <div className={editorStyles.arrayHeader}>
              <h4 className={editorStyles.arrayTitle}>Team Member {idx + 1}</h4>
              <button type="button" onClick={() => removeMember(idx)} className={editorStyles.removeBtn}>
                Remove
              </button>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Name</label>
              <input type="text" value={member.name} onChange={e => updateMember(idx, 'name', e.target.value)} className={styles.input} placeholder="Team member name" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Role</label>
              <input type="text" value={member.role} onChange={e => updateMember(idx, 'role', e.target.value)} className={styles.input} placeholder="e.g., Lead Architect" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Image URL</label>
              <input type="text" value={member.image} onChange={e => updateMember(idx, 'image', e.target.value)} className={styles.input} placeholder="https://example.com/image.jpg" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Upload Image</label>
              <ImageUploadButton onImageUrl={url => updateMember(idx, 'image', url)} loading={saving} />
            </div>
          </div>
        ))}
      </div>

      <button type="button" onClick={addMember} className={editorStyles.addBtn}>
        + Add Member
      </button>

      <div className={editorStyles.previewBlock}>
        <p className={editorStyles.previewTitle}>Live Preview</p>
        <div className={editorStyles.previewCards}>
          {members.map((member, idx) => (
            <div className={editorStyles.previewCard} key={`preview-${idx}`}>
              <div className={editorStyles.previewImageWrap}>
                {member.image ? (
                  <img src={member.image} alt={member.name || `Member ${idx + 1}`} className={editorStyles.previewImage} />
                ) : (
                  <span>No image</span>
                )}
              </div>
              <h5>{member.name || 'Name'}</h5>
              <p>{member.role || 'Role'}</p>
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
