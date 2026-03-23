'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import styles from '@/styles/dashboard/login.module.css'

export default function LoginForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.target)

    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false // Don't let NextAuth handle redirect, we'll do it manually
    })

    if (result?.error) {
      setError('Invalid email or password')
      setLoading(false)
      return
    }

    // Force a full navigation so the server layout reads the fresh session cookie.
    window.location.href = '/dashboard'
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Email</label>
        <input
          name="email"
          type="email"
          className={styles.input}
          placeholder="admin@arcline.com"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Password</label>
        <input
          name="password"
          type="password"
          className={styles.input}
          placeholder="••••••••"
          required
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}