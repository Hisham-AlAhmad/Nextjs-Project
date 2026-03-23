'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '@/styles/dashboard/layout.module.css'

// Each nav item has a required permission
// ADMIN sees everything, EDITOR only sees what's in their permissions[]
const navItems = [
    { label: 'Overview', href: '/dashboard', permission: null },
    { label: 'Projects', href: '/dashboard/projects', permission: 'projects' },
    { label: 'Blog', href: '/dashboard/blog', permission: 'blog' },
    { label: 'News', href: '/dashboard/news', permission: 'news' },
    { label: 'Pages', href: '/dashboard/pages', permission: 'pages' },
    { label: 'Submissions', href: '/dashboard/submissions', permission: 'submissions' },
    { label: 'Users', href: '/dashboard/users', permission: null, adminOnly: true },
]

export default function DashboardSidebar({ role, permissions }) {
    const pathname = usePathname()
    const safePermissions = Array.isArray(permissions) ? permissions : []

    function canAccess(item) {
        if (role === 'ADMIN') return true
        if (item.adminOnly) return false
        if (item.permission === null) return true
        return safePermissions.includes(item.permission)
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarBrand}>
                <span className={styles.sidebarLogo}>ARCLINE</span>
                <span className={styles.sidebarSub}>Dashboard</span>
            </div>

            <nav className={styles.nav}>
                {navItems.filter(canAccess).map(item => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navItem} ${pathname === item.href ? styles.navItemActive : ''}`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className={styles.sidebarFooter}>
                <span className={styles.sidebarVersion}>Arcline Studio v1.0</span>
            </div>
        </aside>
    )
}