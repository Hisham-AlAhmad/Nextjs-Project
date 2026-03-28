'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import styles from '@/styles/public/projectDetail.module.css'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Please write at least 10 characters'),
})

export default function ProjectInquiryForm({ projectId }) {
  const [status, setStatus] = useState(null)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data) {
    setStatus(null)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, projectId }),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      reset()
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.inquiryForm} noValidate>
      <div className={styles.field}>
        <label className={styles.label}>Your Name</label>
        <input {...register('name')} className={`${styles.input} ${errors.name ? styles.inputError : ''}`} placeholder="Sara Al-Rashid" />
        {errors.name && <span className={styles.fieldError}>{errors.name.message}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Email Address</label>
        <input {...register('email')} type="email" className={`${styles.input} ${errors.email ? styles.inputError : ''}`} placeholder="sara@example.com" />
        {errors.email && <span className={styles.fieldError}>{errors.email.message}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>Message</label>
        <textarea {...register('message')} rows={4} className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`} placeholder="I'm interested in a similar project..." />
        {errors.message && <span className={styles.fieldError}>{errors.message.message}</span>}
      </div>

      {status === 'success' && <p className={styles.successMsg}>Your inquiry has been sent!</p>}
      {status === 'error' && <p className={styles.errorMsg}>Something went wrong. Please try again.</p>}

      <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send Inquiry'}
      </button>
    </form>
  )
}
