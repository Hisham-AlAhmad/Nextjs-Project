'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef, useState } from 'react'
import styles from '@/styles/dashboard/richText.module.css'

function ToolbarButton({ onClick, active, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick() }}
      className={`${styles.toolBtn} ${active ? styles.toolBtnActive : ''}`}
      title={title}
    >
      {children}
    </button>
  )
}

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing…' }) {
  const [isClient, setIsClient] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: styles.editorBody,
      },
    },
  })

  // Sync external value changes (e.g. when editing an existing post)
  useEffect(() => {
    if (!editor) return
    if (value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false)
    }
  }, [editor, value])

  if (!isClient || !editor) return null

  async function handleImageUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError('')

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file.')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB.')
      return
    }

    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        setUploadError(data.error || 'Image upload failed.')
        return
      }

      const data = await res.json()
      editor.chain().focus().setImage({ src: data.url }).run()
    } catch {
      setUploadError('Image upload failed. Please try again.')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  function setLink() {
    const prev = editor.getAttributes('link').href
    const url = window.prompt('URL', prev || 'https://')
    if (url === null) return
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className={styles.wrapper}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className={styles.hiddenFileInput}
      />

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.toolGroup}>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold"><b>B</b></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic"><i>I</i></ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough"><s>S</s></ToolbarButton>
        </div>

        <div className={styles.toolSep} />

        <div className={styles.toolGroup}>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolbarButton>
        </div>

        <div className={styles.toolSep} />

        <div className={styles.toolGroup}>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">≡</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">1.</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">&ldquo;</ToolbarButton>
        </div>

        <div className={styles.toolSep} />

        <div className={styles.toolGroup}>
          <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Insert / edit link"><span aria-hidden="true">🔗</span><span className="sr-only">Link</span></ToolbarButton>
          <ToolbarButton
            onClick={() => {
              if (uploadingImage) return
              fileInputRef.current?.click()
            }}
            title={uploadingImage ? 'Uploading image…' : 'Upload and insert image'}
          >
            🖼
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              const src = window.prompt('Image URL', 'https://')
              if (!src) return
              editor.chain().focus().setImage({ src }).run()
            }}
            title="Insert image by URL"
          >
            Img
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">{`</>`}</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">{'{ }'}</ToolbarButton>
        </div>

        <div className={styles.toolSep} />

        <div className={styles.toolGroup}>
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</ToolbarButton>
        </div>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
      {uploadError && <p className={styles.uploadError}>{uploadError}</p>}
    </div>
  )
}
