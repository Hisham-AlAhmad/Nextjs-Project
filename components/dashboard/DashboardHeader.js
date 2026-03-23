'use client'

import { signOut } from 'next-auth/react'
import styles from '@/styles/dashboard/layout.module.css'

export default function DashboardHeader({ user }) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        {/* Page title will be dynamic later */}
      </div>
      <div className={styles.headerRight}>
        <span className={styles.headerUser}>{user.name}</span>
        <span className={styles.headerRole}>{user.role}</span>
        <button
          className={styles.signOutBtn}
          onClick={() => signOut({ callbackUrl: '/dashboard/login' })}
        >
          Sign out
        </button>
      </div>
    </header>
  )
}