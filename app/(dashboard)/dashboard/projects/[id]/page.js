import { redirect } from 'next/navigation'

export default async function ProjectItemPage({ params }) {
  const { id } = await params
  redirect(`/dashboard/projects/${id}/edit`)
}
