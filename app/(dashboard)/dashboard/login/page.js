import LoginForm from '@/components/dashboard/LoginForm'
import styles from '@/styles/dashboard/login.module.css'

export const metadata = {
  title: 'Login — Arcline Dashboard'
}

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.brand}>
          <span className={styles.logo}>ARCLINE</span>
          <p className={styles.sub}>Studio Dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}