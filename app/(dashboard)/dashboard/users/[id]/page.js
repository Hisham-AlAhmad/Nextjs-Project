import { redirect } from 'next/navigation'

export default async function UserItemPage({ params }) {
  const { id } = await params
  redirect(`/dashboard/users/${id}/edit`)
}
