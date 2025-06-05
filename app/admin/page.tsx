'use client'

import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export default function AdminPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  if (!session) {
    redirect('/api/auth/signin')
  }

  return <AdminDashboard />
} 