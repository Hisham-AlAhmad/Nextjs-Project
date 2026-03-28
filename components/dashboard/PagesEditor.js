'use client'

import { useState, useCallback } from 'react'
import styles from '@/styles/dashboard/pages.module.css'

// ── Home Hero ────────────────────────────────────────────────────────────────
function HomeHeroSection({ initialContent, onSave }) {
  const [data, setData] = useState({
    heading: initialContent?.heading ?? '',
    subheading: initialContent?.subheading ?? '',
    ctaText: initialContent?.ctaText ?? '',
    ctaLink: initialContent?.ctaLink ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true); setSaved(false); setError('')
    try {
      await onSave('home', 'hero', data)
      setSaved(true)
    } catch (e) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Hero Section</span>
        {saved && <span className={styles.sectionSaved}>✓ Saved</span>}
      </div>
      <div className={styles.sectionBody}>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <div className={styles.field}>
          <label className={styles.label}>Main Heading</label>
          <input className={styles.input} value={data.heading}
            onChange={e => setData(p => ({ ...p, heading: e.target.value }))}
            placeholder="e.g. Crafting Spaces That Inspire" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Subheading</label>
          <textarea className={styles.textarea} value={data.subheading}
            onChange={e => setData(p => ({ ...p, subheading: e.target.value }))}
            placeholder="A short tagline or description beneath the heading" rows={2} />
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>CTA Button Text</label>
            <input className={styles.input} value={data.ctaText}
              onChange={e => setData(p => ({ ...p, ctaText: e.target.value }))}
              placeholder="e.g. View Projects" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>CTA Button Link</label>
            <input className={styles.input} value={data.ctaLink}
              onChange={e => setData(p => ({ ...p, ctaLink: e.target.value }))}
              placeholder="e.g. /projects" />
          </div>
        </div>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Hero'}
        </button>
      </div>
    </div>
  )
}

// ── Home Stats ────────────────────────────────────────────────────────────────
function HomeStatsSection({ initialContent, onSave }) {
  const [data, setData] = useState({
    projects: initialContent?.projects ?? '',
    years: initialContent?.years ?? '',
    clients: initialContent?.clients ?? '',
    awards: initialContent?.awards ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true); setSaved(false); setError('')
    try { await onSave('home', 'stats', data); setSaved(true) }
    catch (e) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Stats Bar</span>
        {saved && <span className={styles.sectionSaved}>✓ Saved</span>}
      </div>
      <div className={styles.sectionBody}>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Projects Completed</label>
            <input className={styles.input} value={data.projects}
              onChange={e => setData(p => ({ ...p, projects: e.target.value }))}
              placeholder="e.g. 120+" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Years of Experience</label>
            <input className={styles.input} value={data.years}
              onChange={e => setData(p => ({ ...p, years: e.target.value }))}
              placeholder="e.g. 15" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Happy Clients</label>
            <input className={styles.input} value={data.clients}
              onChange={e => setData(p => ({ ...p, clients: e.target.value }))}
              placeholder="e.g. 80+" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Awards Won</label>
            <input className={styles.input} value={data.awards}
              onChange={e => setData(p => ({ ...p, awards: e.target.value }))}
              placeholder="e.g. 12" />
          </div>
        </div>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Stats'}
        </button>
      </div>
    </div>
  )
}

// ── About Mission ─────────────────────────────────────────────────────────────
function AboutMissionSection({ initialContent, onSave }) {
  const [data, setData] = useState({
    heading: initialContent?.heading ?? '',
    text: initialContent?.text ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true); setSaved(false); setError('')
    try { await onSave('about', 'mission', data); setSaved(true) }
    catch (e) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Mission Statement</span>
        {saved && <span className={styles.sectionSaved}>✓ Saved</span>}
      </div>
      <div className={styles.sectionBody}>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <div className={styles.field}>
          <label className={styles.label}>Section Heading</label>
          <input className={styles.input} value={data.heading}
            onChange={e => setData(p => ({ ...p, heading: e.target.value }))}
            placeholder="e.g. Our Mission" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Mission Text</label>
          <textarea className={styles.textarea} rows={5} value={data.text}
            onChange={e => setData(p => ({ ...p, text: e.target.value }))}
            placeholder="Describe the studio's mission, vision and values…" />
        </div>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Mission'}
        </button>
      </div>
    </div>
  )
}

// ── About Team ────────────────────────────────────────────────────────────────
function AboutTeamSection({ initialContent, onSave }) {
  const [members, setMembers] = useState(
    Array.isArray(initialContent) ? initialContent : []
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function addMember() {
    setMembers(p => [...p, { name: '', role: '', bio: '', image: '' }])
  }

  function updateMember(i, field, val) {
    setMembers(p => p.map((m, idx) => idx === i ? { ...m, [field]: val } : m))
  }

  function removeMember(i) {
    setMembers(p => p.filter((_, idx) => idx !== i))
  }

  async function handleSave() {
    setSaving(true); setSaved(false); setError('')
    try { await onSave('about', 'team', members); setSaved(true) }
    catch (e) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Team Members</span>
        {saved && <span className={styles.sectionSaved}>✓ Saved</span>}
      </div>
      <div className={styles.sectionBody}>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <div className={styles.itemsList}>
          {members.map((member, i) => (
            <div key={i} className={styles.itemCard}>
              <div className={styles.itemCardHeader}>
                <span className={styles.itemCardNum}>Member {i + 1}</span>
                <button type="button" className={styles.btnRemoveItem} onClick={() => removeMember(i)}>Remove</button>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Name</label>
                  <input className={styles.input} value={member.name}
                    onChange={e => updateMember(i, 'name', e.target.value)}
                    placeholder="e.g. Sara Al-Hassan" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Role / Title</label>
                  <input className={styles.input} value={member.role}
                    onChange={e => updateMember(i, 'role', e.target.value)}
                    placeholder="e.g. Founder & Lead Designer" />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Bio</label>
                <textarea className={styles.textarea} rows={2} value={member.bio}
                  onChange={e => updateMember(i, 'bio', e.target.value)}
                  placeholder="Short bio…" />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Photo URL</label>
                <input className={styles.input} value={member.image}
                  onChange={e => updateMember(i, 'image', e.target.value)}
                  placeholder="/uploads/sara.jpg" />
              </div>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn} onClick={addMember}>
            + Add team member
          </button>
        </div>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Team'}
        </button>
      </div>
    </div>
  )
}

// ── Services List ─────────────────────────────────────────────────────────────
function ServicesListSection({ initialContent, onSave }) {
  const [services, setServices] = useState(
    Array.isArray(initialContent) ? initialContent : []
  )
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function addService() {
    setServices(p => [...p, { title: '', description: '', icon: '' }])
  }

  function updateService(i, field, val) {
    setServices(p => p.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  function removeService(i) {
    setServices(p => p.filter((_, idx) => idx !== i))
  }

  async function handleSave() {
    setSaving(true); setSaved(false); setError('')
    try { await onSave('services', 'list', services); setSaved(true) }
    catch (e) { setError(e.message) } finally { setSaving(false) }
  }

  return (
    <div className={styles.sectionCard}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Services</span>
        {saved && <span className={styles.sectionSaved}>✓ Saved</span>}
      </div>
      <div className={styles.sectionBody}>
        {error && <p className={styles.errorMsg}>{error}</p>}
        <div className={styles.itemsList}>
          {services.map((service, i) => (
            <div key={i} className={styles.itemCard}>
              <div className={styles.itemCardHeader}>
                <span className={styles.itemCardNum}>Service {i + 1}</span>
                <button type="button" className={styles.btnRemoveItem} onClick={() => removeService(i)}>Remove</button>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label className={styles.label}>Title</label>
                  <input className={styles.input} value={service.title}
                    onChange={e => updateService(i, 'title', e.target.value)}
                    placeholder="e.g. Residential Design" />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Icon (optional)</label>
                  <input className={styles.input} value={service.icon}
                    onChange={e => updateService(i, 'icon', e.target.value)}
                    placeholder="e.g. 🏠 or /icons/home.svg" />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Description</label>
                <textarea className={styles.textarea} rows={2} value={service.description}
                  onChange={e => updateService(i, 'description', e.target.value)}
                  placeholder="Describe this service…" />
              </div>
            </div>
          ))}
          <button type="button" className={styles.addItemBtn} onClick={addService}>
            + Add service
          </button>
        </div>
        <button className={styles.saveBtn} onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Services'}
        </button>
      </div>
    </div>
  )
}

// ── Main page component ───────────────────────────────────────────────────────
const PAGES = ['home', 'about', 'services']

export default function PagesEditor({ sections }) {
  const [activePage, setActivePage] = useState('home')

  // Build a lookup: { "home/hero": {...content}, ... }
  const contentMap = {}
  for (const s of sections) {
    contentMap[`${s.page}/${s.section}`] = s.content
  }

  const onSave = useCallback(async (page, section, content) => {
    const res = await fetch(`/api/pages/${page}/${section}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || 'Save failed')
    }
  }, [])

  return (
    <div>
      <div className={styles.tabs}>
        {PAGES.map(p => (
          <button
            key={p}
            className={`${styles.tab} ${activePage === p ? styles.tabActive : ''}`}
            onClick={() => setActivePage(p)}
          >
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {activePage === 'home' && (
        <div className={styles.sectionsGrid}>
          <HomeHeroSection
            initialContent={contentMap['home/hero']}
            onSave={onSave}
          />
          <HomeStatsSection
            initialContent={contentMap['home/stats']}
            onSave={onSave}
          />
        </div>
      )}

      {activePage === 'about' && (
        <div className={styles.sectionsGrid}>
          <AboutMissionSection
            initialContent={contentMap['about/mission']}
            onSave={onSave}
          />
          <AboutTeamSection
            initialContent={contentMap['about/team']}
            onSave={onSave}
          />
        </div>
      )}

      {activePage === 'services' && (
        <div className={styles.sectionsGrid}>
          <ServicesListSection
            initialContent={contentMap['services/list']}
            onSave={onSave}
          />
        </div>
      )}
    </div>
  )
}
