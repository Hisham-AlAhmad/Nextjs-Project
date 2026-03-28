'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
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
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
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

  if (!editor) return null

  function setLink() {
    const prev = editor.getAttributes('link').href
    const url = window.prompt('URL', prev || 'https://')
    if (url === null) return
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className={styles.wrapper}>
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
          <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">{`</>`}</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code block">{ '{ }' }</ToolbarButton>
        </div>

        <div className={styles.toolSep} />

        <div className={styles.toolGroup}>
          <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">↩</ToolbarButton>
          <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">↪</ToolbarButton>
        </div>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />
    </div>
  )
}
