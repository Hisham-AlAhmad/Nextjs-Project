import prisma from '@/lib/prisma'

export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, projectType, message } = body

    if (!name || !email || !message) {
      return Response.json({ error: 'Name, email, and message are required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return Response.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const submission = await prisma.contactSubmission.create({
      data: {
        name: String(name).trim(),
        email: String(email).trim().toLowerCase(),
        projectType: projectType ? String(projectType).trim() : null,
        message: String(message).trim(),
      },
    })
    return Response.json({ success: true, id: submission.id }, { status: 201 })
  } catch {
    return Response.json({ error: 'Failed to submit' }, { status: 500 })
  }
}
