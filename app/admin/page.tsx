'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import ResetPasswordForm from '@/app/components/ResetPasswordForm'

export default function AdminDashboard() {
  const { data: session } = useSession()
  const router = useRouter()
  const [showPasswordReset, setShowPasswordReset] = useState(false)

  if (!session?.user || session.user.role !== 'ADMIN') {
    return <div>Access denied</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowPasswordReset(!showPasswordReset)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {showPasswordReset ? 'Cancel' : 'Reset Password'}
          </button>
          <button
            onClick={() => router.push('/admin/users')}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Manage Users
          </button>
        </div>
      </div>

      {showPasswordReset && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Reset Your Password</h2>
          <ResetPasswordForm
            userId={session.user.id}
            userName={session.user.name || 'Your'}
            onSuccess={() => setShowPasswordReset(false)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Welcome, {session.user.name}</h2>
          <p className="text-gray-600">You are logged in as an administrator.</p>
        </div>
      </div>
    </div>
  )
} 