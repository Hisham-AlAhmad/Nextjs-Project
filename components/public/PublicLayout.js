import Navbar from './Navbar'
import Footer from './Footer'
import styles from '@/styles/public/publicLayout.module.css'

export default function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className={styles.main}>
        {children}
      </main>
      <Footer />
    </>
  )
}
