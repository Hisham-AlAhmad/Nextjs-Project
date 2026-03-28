import prisma from '@/lib/prisma'

export async function GET() {
  const sections = await prisma.pageContent.findMany({
    orderBy: [{ page: 'asc' }, { section: 'asc' }],
  })
  return Response.json(sections)
}
