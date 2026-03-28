'use client'

import { useRouter, usePathname } from 'next/navigation'
import subStyles from '@/styles/dashboard/submissions.module.css'

export default function SubmissionTabs({ activeTab, unreadContacts, unreadInquiries }) {
  const router = useRouter()
  const pathname = usePathname()

  function setTab(tab) {
    router.push(`${pathname}?tab=${tab}`)
  }

  return (
    <div className={subStyles.tabs}>
      <button
        className={`${subStyles.tab} ${activeTab === 'contact' ? subStyles.tabActive : ''}`}
        onClick={() => setTab('contact')}
      >
        Contact {unreadContacts > 0 && `(${unreadContacts} unread)`}
      </button>
      <button
        className={`${subStyles.tab} ${activeTab === 'inquiries' ? subStyles.tabActive : ''}`}
        onClick={() => setTab('inquiries')}
      >
        Project Inquiries {unreadInquiries > 0 && `(${unreadInquiries} unread)`}
      </button>
    </div>
  )
}
