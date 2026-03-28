'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import styles from '@/styles/dashboard/form.module.css'

const RichTextEditor = dynamic(() => import('@/components/dashboard/RichTextEditor'), { ssr: false })

export default function BlogPostForm({ post }) {
  const router = useRouter()
  const isEdit = !!post

  const [title, setTitle] = useState(post?.title ?? '')
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '')
  const [content, setContent] = useState(post?.content ?? '')
  const [tags, setTags] = useState(
    Array.isArray(post?.tags) ? post.tags.join(', ') : ''
  )
  const [published, setPublished] = useState(post?.published ?? false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError('Title, excerpt and content are required.')
      return
    }

    const tagList = tags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)

    setSaving(true)
    try {
      const url = isEdit ? `/api/blog/${post.id}` : '/api/blog'
      const method = isEdit ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, content, tags: tagList, published }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong.')
        return
      }
      setSuccess(isEdit ? 'Post updated.' : 'Post created.')
      if (!isEdit) {
        router.push('/dashboard/blog')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <p className={styles.errorMsg}>{error}</p>}
      {success && <p className={styles.successMsg}>{success}</p>}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">Title</label>
        <input
          id="title"
          className={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Post title"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="excerpt">Excerpt</label>
        <textarea
          id="excerpt"
          className={styles.textarea}
          value={excerpt}
          onChange={e => setExcerpt(e.target.value)}
          placeholder="Short summary shown in listings"
          rows={3}
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Content</label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="tags">Tags</label>
        <input
          id="tags"
          className={styles.input}
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="e.g. interior, lighting, minimalism"
        />
        <span className={styles.tagsHint}>Separate tags with commas</span>
      </div>

      <div className={styles.field}>
        <div className={styles.toggleRow}>
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
          />
          <label className={styles.toggleLabel} htmlFor="published">
            Published (visible on the website)
          </label>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.btnPrimary} disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Update Post' : 'Create Post'}
        </button>
        <Link href="/dashboard/blog" className={styles.btnSecondary}>
          Cancel
        </Link>
      </div>
    </form>
  )
}
