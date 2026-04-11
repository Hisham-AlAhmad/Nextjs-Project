'use client'

import { useMemo, useState } from 'react'
import { PERMISSION_ACTIONS, PERMISSION_SECTIONS, normalizePermissions } from '@/lib/permissions'
import styles from '@/styles/dashboard/form.module.css'

const prettyAction = {
    view: 'View',
    add: 'Add',
    edit: 'Edit',
    delete: 'Delete',
}

export default function RoleManager({ initialRoles }) {
    const [roles, setRoles] = useState(Array.isArray(initialRoles) ? initialRoles : [])
    const [name, setName] = useState('')
    const [permissions, setPermissions] = useState([])
    const [editingRoleId, setEditingRoleId] = useState(null)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const isEditing = Boolean(editingRoleId)

    const sortedRoles = useMemo(
        () => [...roles].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
        [roles]
    )

    function togglePermission(section, action) {
        const key = `${section}:${action}`
        setPermissions(prev => (prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]))
    }

    function startEdit(role) {
        setEditingRoleId(role.id)
        setName(role.name)
        setPermissions(normalizePermissions(role.permissions))
        setError('')
    }

    function resetForm() {
        setEditingRoleId(null)
        setName('')
        setPermissions([])
        setError('')
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setError('')
        setSaving(true)

        try {
            const method = isEditing ? 'PUT' : 'POST'
            const url = isEditing ? `/api/roles/${editingRoleId}` : '/api/roles'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, permissions }),
            })

            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Failed to save role')
                return
            }

            if (isEditing) {
                setRoles(prev => prev.map(role => (role.id === data.id ? data : role)))
            } else {
                setRoles(prev => [data, ...prev])
            }

            resetForm()
        } catch {
            setError('Network error')
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(roleId) {
        if (!confirm('Delete this role?')) return

        setError('')
        setSaving(true)

        try {
            const res = await fetch(`/api/roles/${roleId}`, { method: 'DELETE' })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Failed to delete role')
                return
            }

            setRoles(prev => prev.filter(role => role.id !== roleId))
            if (editingRoleId === roleId) resetForm()
        } catch {
            setError('Network error')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div style={{ display: 'grid', gap: '20px' }}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <label className={styles.label}>Role Name</label>
                    <input
                        className={styles.input}
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Blog Editor"
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Permissions</label>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {PERMISSION_SECTIONS.map(section => (
                            <div key={section} style={{ border: '0.5px solid var(--color-border-light)', borderRadius: '10px', padding: '10px 12px' }}>
                                <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--color-ink)', textTransform: 'capitalize' }}>{section}</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                                    {PERMISSION_ACTIONS.map(action => {
                                        const key = `${section}:${action}`
                                        return (
                                            <label key={key} className={styles.checkLabel}>
                                                <input
                                                    type="checkbox"
                                                    className={styles.checkbox}
                                                    checked={permissions.includes(key)}
                                                    onChange={() => togglePermission(section, action)}
                                                />
                                                {prettyAction[action]}
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.actions}>
                    <button type="submit" className={styles.saveBtn} disabled={saving}>
                        {saving ? 'Saving...' : isEditing ? 'Save Role' : 'Create Role'}
                    </button>
                    {isEditing && (
                        <button type="button" className={styles.secondaryBtn} onClick={resetForm} disabled={saving}>
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <div className={styles.form}>
                <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 500 }}>Existing Roles</h3>
                {sortedRoles.length === 0 ? (
                    <p className={styles.helperText}>No custom roles yet.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {sortedRoles.map(role => {
                            const perms = normalizePermissions(role.permissions)
                            return (
                                <div key={role.id} style={{ border: '0.5px solid var(--color-border-light)', borderRadius: '10px', padding: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'center' }}>
                                        <div>
                                            <p style={{ margin: 0, fontWeight: 600 }}>{role.name}</p>
                                            <p className={styles.helperText} style={{ margin: '4px 0 0' }}>
                                                Assigned to {role._count?.users || 0} user{role._count?.users === 1 ? '' : 's'}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button type="button" className={styles.secondaryBtn} onClick={() => startEdit(role)} disabled={saving}>Edit</button>
                                            <button type="button" className={styles.deleteBtn} onClick={() => handleDelete(role.id)} disabled={saving}>Delete</button>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                                        {perms.map(perm => (
                                            <span key={perm} style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '999px', background: 'var(--color-sand)', color: 'var(--color-stone)' }}>
                                                {perm}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
