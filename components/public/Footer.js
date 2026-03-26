import Link from 'next/link'
import styles from '@/styles/public/footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>ARCLINE</span>
          <p className={styles.tagline}>Architecture + perfect lines</p>
        </div>
        <div className={styles.cols}>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Navigate</h4>
            <ul className={styles.colLinks}>
              <li><Link href="/projects" className={styles.colLink}>Projects</Link></li>
              <li><Link href="/blog" className={styles.colLink}>Blog</Link></li>
              <li><Link href="/news" className={styles.colLink}>News</Link></li>
              <li><Link href="/about" className={styles.colLink}>About</Link></li>
              <li><Link href="/services" className={styles.colLink}>Services</Link></li>
            </ul>
          </div>
          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contact</h4>
            <ul className={styles.colLinks}>
              <li><a href="mailto:studio@arcline.com" className={styles.colLink}>studio@arcline.com</a></li>
              <li><Link href="/contact" className={styles.colLink}>Send a message</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <p className={styles.copy}>© {new Date().getFullYear()} Arcline Studio. All rights reserved.</p>
      </div>
    </footer>
  )
}
