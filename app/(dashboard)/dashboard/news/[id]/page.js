import { redirect } from 'next/navigation'

export default async function NewsItemPage({ params }) {
  const { id } = await params
  redirect(`/dashboard/news/${id}/edit`)
}
