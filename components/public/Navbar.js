'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from '@/styles/public/navbar.module.css'

const links = [
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'News', href: '/news' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
]

export default function Navbar() {
  const pathname = usePathname()
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/" className={styles.brand}>ARCLINE</Link>
        <ul className={styles.links}>
          {links.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${styles.link} ${pathname.startsWith(link.href) ? styles.linkActive : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/contact" className={styles.cta}>Contact</Link>
      </nav>
    </header>
  )
}
