export const PERMISSION_SECTIONS = ['projects', 'blog', 'news', 'pages', 'submissions']
export const PERMISSION_ACTIONS = ['view', 'add', 'edit', 'delete']

export function normalizePermissions(input) {
    const list = Array.isArray(input) ? input : []
    const normalized = new Set()

    for (const raw of list) {
        if (typeof raw !== 'string') continue
        const value = raw.trim().toLowerCase()
        if (!value) continue

        const [section, action] = value.split(':')

        if (PERMISSION_SECTIONS.includes(section) && PERMISSION_ACTIONS.includes(action)) {
            normalized.add(`${section}:${action}`)
            continue
        }

        // Backward compatibility: old values were just section names like "blog".
        if (PERMISSION_SECTIONS.includes(value)) {
            for (const allowedAction of PERMISSION_ACTIONS) {
                normalized.add(`${value}:${allowedAction}`)
            }
        }
    }

    return [...normalized]
}

export function hasPermission({ role, permissions }, section, action = 'view') {
    if (role === 'ADMIN') return true
    if (!PERMISSION_SECTIONS.includes(section) || !PERMISSION_ACTIONS.includes(action)) return false

    const safePermissions = normalizePermissions(permissions)
    return safePermissions.includes(`${section}:${action}`)
}

export function canAccessSection(userAccess, section) {
    for (const action of PERMISSION_ACTIONS) {
        if (hasPermission(userAccess, section, action)) return true
    }
    return false
}

export function resolveEffectivePermissions(user) {
    if (user?.role === 'ADMIN') return []

    const rolePermissions = normalizePermissions(user?.dashboardRole?.permissions)
    if (rolePermissions.length > 0) return rolePermissions

    return normalizePermissions(user?.permissions)
}
