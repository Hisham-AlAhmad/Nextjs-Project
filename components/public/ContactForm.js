'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import styles from '@/styles/public/contact.module.css'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  projectType: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

const projectTypes = ['Residential', 'Commercial', 'Interior', 'Hospitality', 'Urban', 'Renovation', 'Other']

export default function ContactForm() {
  const [status, setStatus] = useState(null) // null | 'success' | 'error'
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data) {
    setStatus(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Full Name</label>
          <input {...register('name')} className={`${styles.input} ${errors.name ? styles.inputError : ''}`} placeholder="Mohamad Ali" />
          {errors.name && <span className={styles.fieldError}>{errors.name.message}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Email Address</label>
          <input {...register('email')} type="email" className={`${styles.input} ${errors.email ? styles.inputError : ''}`} placeholder="mohamad@example.com" />
          {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Project Type <span className={styles.optional}>(optional)</span></label>
        <select {...register('projectType')} className={styles.select}>
          <option value="">Select a type...</option>
          {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Message</label>
        <textarea {...register('message')} rows={6} className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`} placeholder="Tell us about your project..." />
        {errors.message && <span className={styles.fieldError}>{errors.message.message}</span>}
      </div>

      {status === 'success' && (
        <p className={styles.successMsg}>Your message has been sent. We&apos;ll be in touch soon.</p>
      )}
      {status === 'error' && (
        <p className={styles.errorMsg}>Something went wrong. Please try again.</p>
      )}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  )
}
