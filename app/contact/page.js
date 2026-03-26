import PublicLayout from '@/components/public/PublicLayout'
import ContactForm from '@/components/public/ContactForm'
import styles from '@/styles/public/contact.module.css'

export const metadata = {
  title: 'Contact — Arcline Studio',
  description: 'Get in touch with Arcline Studio for your next project.',
}

export default function ContactPage() {
  return (
    <PublicLayout>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Get In Touch</h1>
          <p className={styles.heroSub}>We&apos;d love to hear about your project.</p>
        </div>
      </section>

      <section className={styles.body}>
        <div className={styles.bodyInner}>
          <div className={styles.info}>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Studio</h3>
              <p className={styles.infoText}>Arcline Studio<br />Beirut, Lebanon</p>
            </div>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>Email</h3>
              <a href="mailto:studio@arcline.com" className={styles.infoLink}>studio@arcline.com</a>
            </div>
            <div className={styles.infoBlock}>
              <h3 className={styles.infoLabel}>New Projects</h3>
              <a href="mailto:projects@arcline.com" className={styles.infoLink}>projects@arcline.com</a>
            </div>
          </div>
          <div className={styles.formWrap}>
            <ContactForm />
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
