'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PERMISSION_ACTIONS, PERMISSION_SECTIONS, normalizePermissions } from '@/lib/permissions'
import styles from '@/styles/dashboard/form.module.css'

const ALL_PERMISSIONS = PERMISSION_SECTIONS.flatMap(section => PERMISSION_ACTIONS.map(action => `${section}:${action}`))

export default function UserForm({ user }) {
  const router = useRouter()
  const isEdit = Boolean(user)

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'EDITOR',
    dashboardRoleId: user?.dashboardRoleId || '',
    permissions: normalizePermissions(user?.permissions),
  })
  const [availableRoles, setAvailableRoles] = useState([])
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    async function loadRoles() {
      try {
        const res = await fetch('/api/roles')
        if (!res.ok) return
        const data = await res.json()
        setAvailableRoles(Array.isArray(data) ? data : [])
      } finally {
        setLoadingRoles(false)
      }
    }

    loadRoles()
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  function handlePermissionToggle(perm) {
    setForm(f => ({
      ...f,
      dashboardRoleId: '',
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter(p => p !== perm)
        : [...f.permissions, perm],
    }))
  }

  function applyRoleTemplate(roleId) {
    const pickedRole = availableRoles.find(role => String(role.id) === String(roleId))
    setForm(f => ({
      ...f,
      dashboardRoleId: roleId,
      permissions: pickedRole ? normalizePermissions(pickedRole.permissions) : f.permissions,
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSaving(true)

    const payload = { ...form }
    if (!payload.password) delete payload.password

    try {
      const url = isEdit ? `/api/users/${user.id}` : '/api/users'
      const method = isEdit ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to save')
        return
      }

      router.push('/dashboard/users')
      router.refresh()
    } catch {
      setError('Network error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this user? This cannot be undone.')) return
    setDeleting(true)

    try {
      const res = await fetch(`/api/users/${user.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Failed to delete')
        return
      }
      router.push('/dashboard/users')
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
          <label className={styles.label}>Full Name *</label>
          <input name="name" value={form.name} onChange={handleChange} className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className={styles.input} required />
        </div>
      </div>

      <div className={styles.grid2}>
        <div className={styles.field}>
          <label className={styles.label}>Password {isEdit ? <span className={styles.hint}>(leave blank to keep current)</span> : '*'}</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className={styles.input} {...(!isEdit ? { required: true } : {})} placeholder={isEdit ? '••••••••' : ''} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Role</label>
          <select name="role" value={form.role} onChange={handleChange} className={styles.select}>
            <option value="EDITOR">Editor</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
      </div>

      {form.role === 'EDITOR' && (
        <>
          <div className={styles.field}>
            <label className={styles.label}>Assigned Role Template</label>
            <select
              value={form.dashboardRoleId}
              onChange={e => applyRoleTemplate(e.target.value)}
              className={styles.select}
            >
              <option value="">No template (manual permissions)</option>
              {availableRoles.map(role => (
                <option key={role.id} value={role.id}>{role.name}</option>
              ))}
            </select>
            <p className={styles.helperText}>
              {loadingRoles ? 'Loading roles...' : 'Pick a reusable role, or leave empty for custom permissions below.'}
            </p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Permissions</label>
            <div style={{ display: 'grid', gap: '8px', paddingTop: '4px' }}>
              {ALL_PERMISSIONS.map(perm => (
                <label key={perm} className={styles.checkLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={form.permissions.includes(perm)}
                    onChange={() => handlePermissionToggle(perm)}
                  />
                  {perm}
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create User'}
        </button>
        {isEdit && (
          <button type="button" onClick={handleDelete} className={styles.deleteBtn} disabled={deleting}>
            {deleting ? 'Deleting...' : 'Delete User'}
          </button>
        )}
      </div>
    </form>
  )
}
