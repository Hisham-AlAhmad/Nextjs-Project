import { redirect } from 'next/navigation'

export default async function BlogItemPage({ params }) {
  const { id } = await params
  redirect(`/dashboard/blog/${id}/edit`)
}
