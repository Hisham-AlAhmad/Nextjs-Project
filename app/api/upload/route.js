import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { createHash } from 'crypto'

function sanitizeBaseName(name = 'image') {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48) || 'image'
}

function extensionFromFile(file) {
  const typeMap = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/svg+xml': 'svg',
    'image/avif': 'avif',
  }

  if (typeMap[file.type]) return typeMap[file.type]

  const ext = file.name?.split('.').pop()?.toLowerCase()
  return ext || 'jpg'
}

export async function POST(request) {
  try {
    // Require authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return Response.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return Response.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Deterministic filename so re-uploading identical files reuses URL
    const hash = createHash('sha256').update(buffer).digest('hex').slice(0, 16)
    const baseName = sanitizeBaseName(file.name)
    const ext = extensionFromFile(file)
    const filename = `${baseName}-${hash}.${ext}`

    const path = join(uploadDir, filename)
    if (!existsSync(path)) {
      await writeFile(path, buffer)
    }

    // Return URL
    const url = `/uploads/${filename}`
    return Response.json({ url }, { status: 200 })
  } catch (error) {
    console.error('Upload error:', error)
    return Response.json({ error: 'Upload failed' }, { status: 500 })
  }
}
