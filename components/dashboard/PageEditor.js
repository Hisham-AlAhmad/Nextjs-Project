'use client'

import { useState } from 'react'
import editorStyles from '@/styles/dashboard/pageEditor.module.css'
import { ImageUploadButton } from './ImageUploadButton'

const DEFAULTS = {
  home_hero: {
    heading: 'Spaces That Endure',
    subheading: 'We design architecture that transcends trends.',
    ctaText: 'View Our Work',
  },
  home_stats: {
    projects: '120+',
    years: '15',
    awards: '30+',
    countries: '8',
  },
  about_mission: {
    heading: 'Our Mission',
    text: 'Describe the studio mission and point of view.',
  },
  about_team: [
    { name: 'Team Member', role: 'Role', image: '' },
  ],
  services_list: [
    { title: 'Service Title', description: 'Explain this service.', icon: '⌂' },
  ],
}

function sectionKey(page, section) {
  return `${page}_${section}`
}

function normalizeContent(page, section, initialContent) {
  const key = sectionKey(page, section)
  const fallback = DEFAULTS[key]
  if (initialContent === null || initialContent === undefined || initialContent === '') {
    return structuredClone(fallback)
  }
  try {
    if (typeof initialContent === 'string') {
      const parsed = JSON.parse(initialContent)
      return parsed
    }
    return initialContent
  } catch {
    return structuredClone(fallback)
  }
}

export default function PageEditor({ page, section, label, hint, initialContent }) {
  const [value, setValue] = useState(() => normalizeContent(page, section, initialContent))
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState(null) // null | 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSave() {
    setSaving(true)
    setStatus(null)

    try {
      const res = await fetch('/api/pages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, section, content: value }),
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

  function updateField(field, fieldValue) {
    setValue(prev => ({ ...prev, [field]: fieldValue }))
    setStatus(null)
  }

  function updateArrayItem(index, key, fieldValue) {
    setValue(prev => prev.map((item, i) => (i === index ? { ...item, [key]: fieldValue } : item)))
    setStatus(null)
  }

  function addArrayItem() {
    const key = sectionKey(page, section)
    const template = key === 'about_team'
      ? { name: '', role: '', image: '' }
      : { title: '', description: '', icon: '' }
    setValue(prev => [...prev, template])
    setStatus(null)
  }

  function removeArrayItem(index) {
    setValue(prev => prev.filter((_, i) => i !== index))
    setStatus(null)
  }

  function renderForm() {
    const key = sectionKey(page, section)

    if (key === 'home_hero') {
      return (
        <div className={editorStyles.fieldsGrid}>
          <label className={editorStyles.field}>
            <span>Hero Heading</span>
            <input className={editorStyles.input} value={value.heading || ''} onChange={e => updateField('heading', e.target.value)} />
          </label>
          <label className={editorStyles.field}>
            <span>Hero Subheading</span>
            <textarea className={editorStyles.textarea} value={value.subheading || ''} onChange={e => updateField('subheading', e.target.value)} rows={3} />
          </label>
          <label className={editorStyles.field}>
            <span>Primary CTA Text</span>
            <input className={editorStyles.input} value={value.ctaText || ''} onChange={e => updateField('ctaText', e.target.value)} />
          </label>
        </div>
      )
    }

    if (key === 'home_stats') {
      return (
        <div className={editorStyles.statsGrid}>
          {[
            ['projects', 'Projects Delivered'],
            ['years', 'Years of Practice'],
            ['awards', 'Design Awards'],
            ['countries', 'Countries'],
          ].map(([field, labelText]) => (
            <label key={field} className={editorStyles.field}>
              <span>{labelText}</span>
              <input className={editorStyles.input} value={value[field] || ''} onChange={e => updateField(field, e.target.value)} />
            </label>
          ))}
        </div>
      )
    }

    if (key === 'about_mission') {
      return (
        <div className={editorStyles.fieldsGrid}>
          <label className={editorStyles.field}>
            <span>Mission Heading</span>
            <input className={editorStyles.input} value={value.heading || ''} onChange={e => updateField('heading', e.target.value)} />
          </label>
          <label className={editorStyles.field}>
            <span>Mission Text</span>
            <textarea className={editorStyles.textarea} value={value.text || ''} onChange={e => updateField('text', e.target.value)} rows={4} />
          </label>
        </div>
      )
    }

    if (key === 'about_team') {
      return (
        <div className={editorStyles.arrayList}>
          {value.map((member, index) => (
            <div key={`member-${index}`} className={editorStyles.arrayItem}>
              <div className={editorStyles.arrayHeader}>
                <strong>Team Member {index + 1}</strong>
                <button type="button" className={editorStyles.removeBtn} onClick={() => removeArrayItem(index)}>Remove</button>
              </div>
              <div className={editorStyles.fieldsGrid}>
                <label className={editorStyles.field}>
                  <span>Name</span>
                  <input className={editorStyles.input} value={member.name || ''} onChange={e => updateArrayItem(index, 'name', e.target.value)} />
                </label>
                <label className={editorStyles.field}>
                  <span>Role</span>
                  <input className={editorStyles.input} value={member.role || ''} onChange={e => updateArrayItem(index, 'role', e.target.value)} />
                </label>
                <label className={editorStyles.field}>
                  <span>Image URL</span>
                  <input className={editorStyles.input} value={member.image || ''} onChange={e => updateArrayItem(index, 'image', e.target.value)} placeholder="https://..." />
                </label>
                <div className={editorStyles.field}>
                  <span>Upload Team Image</span>
                  <ImageUploadButton onImageUrl={url => updateArrayItem(index, 'image', url)} loading={saving} />
                </div>
              </div>
            </div>
          ))}
          <button type="button" className={editorStyles.addBtn} onClick={addArrayItem}>Add Team Member</button>
        </div>
      )
    }

    return (
      <div className={editorStyles.arrayList}>
        {value.map((item, index) => (
          <div key={`service-${index}`} className={editorStyles.arrayItem}>
            <div className={editorStyles.arrayHeader}>
              <strong>Service {index + 1}</strong>
              <button type="button" className={editorStyles.removeBtn} onClick={() => removeArrayItem(index)}>Remove</button>
            </div>
            <div className={editorStyles.fieldsGrid}>
              <label className={editorStyles.field}>
                <span>Service Title</span>
                <input className={editorStyles.input} value={item.title || ''} onChange={e => updateArrayItem(index, 'title', e.target.value)} />
              </label>
              <label className={editorStyles.field}>
                <span>Description</span>
                <textarea className={editorStyles.textarea} value={item.description || ''} onChange={e => updateArrayItem(index, 'description', e.target.value)} rows={3} />
              </label>
              <label className={editorStyles.field}>
                <span>Icon</span>
                <input className={editorStyles.input} value={item.icon || ''} onChange={e => updateArrayItem(index, 'icon', e.target.value)} placeholder="⌂" maxLength={3} />
              </label>
            </div>
          </div>
        ))}
        <button type="button" className={editorStyles.addBtn} onClick={addArrayItem}>Add Service</button>
      </div>
    )
  }

  function renderPreview() {
    const key = sectionKey(page, section)

    if (key === 'home_hero') {
      return (
        <div className={editorStyles.previewHero}>
          <h4>{value.heading || 'Heading'}</h4>
          <p>{value.subheading || 'Subheading preview...'}</p>
          <button type="button">{value.ctaText || 'CTA'}</button>
        </div>
      )
    }

    if (key === 'home_stats') {
      return (
        <div className={editorStyles.previewStats}>
          <div><strong>{value.projects || '0'}</strong><span>Projects</span></div>
          <div><strong>{value.years || '0'}</strong><span>Years</span></div>
          <div><strong>{value.awards || '0'}</strong><span>Awards</span></div>
          <div><strong>{value.countries || '0'}</strong><span>Countries</span></div>
        </div>
      )
    }

    if (key === 'about_mission') {
      return (
        <div className={editorStyles.previewText}>
          <h4>{value.heading || 'Mission Heading'}</h4>
          <p>{value.text || 'Mission text preview...'}</p>
        </div>
      )
    }

    if (key === 'about_team') {
      return (
        <div className={editorStyles.previewCards}>
          {value.map((member, index) => (
            <div className={editorStyles.previewCard} key={`preview-member-${index}`}>
              <div className={editorStyles.previewImageWrap}>
                {member.image ? <img src={member.image} alt={member.name || `Member ${index + 1}`} className={editorStyles.previewImage} /> : <span>No image</span>}
              </div>
              <h5>{member.name || 'Name'}</h5>
              <p>{member.role || 'Role'}</p>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className={editorStyles.previewCards}>
        {value.map((service, index) => (
          <div className={editorStyles.previewCard} key={`preview-service-${index}`}>
            <span className={editorStyles.previewIcon}>{service.icon || '⌂'}</span>
            <h5>{service.title || 'Service Title'}</h5>
            <p>{service.description || 'Service description preview...'}</p>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={editorStyles.block}>
      <div className={editorStyles.blockHeader}>
        <div>
          <h3 className={editorStyles.blockLabel}>{label}</h3>
          <p className={editorStyles.blockHint}>{hint}</p>
        </div>
      </div>

      {renderForm()}

      <div className={editorStyles.previewBlock}>
        <p className={editorStyles.previewTitle}>Live Preview</p>
        {renderPreview()}
      </div>

      {status === 'success' && <p className={editorStyles.successMsg}>Saved successfully.</p>}
      {status === 'error' && <p className={editorStyles.errorMsg}>{errorMsg}</p>}
      <button onClick={handleSave} className={editorStyles.saveBtn} disabled={saving}>
        {saving ? 'Saving...' : 'Save'}
      </button>
    </div>
  )
}
