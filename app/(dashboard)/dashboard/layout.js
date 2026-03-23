import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import AuthSessionProvider from '@/components/dashboard/SessionProvider'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import styles from '@/styles/dashboard/layout.module.css'

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions)

  // Login page lives under this layout; redirecting here can cause loops.
  // Proxy already protects private dashboard routes.
  if (!session) {
    return children
  }

  return (
    <AuthSessionProvider session={session}>
      <div className={styles.wrapper}>
        <DashboardSidebar role={session.user.role} permissions={session.user.permissions} />
        <div className={styles.main}>
          <DashboardHeader user={session.user} />
          <div className={styles.content}>
            {children}
          </div>
        </div>
      </div>
    </AuthSessionProvider>
  )
}