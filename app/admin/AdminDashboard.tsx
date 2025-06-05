'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Content {
  id: string
  title: string
  content: string
  section: string
  order: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [contents, setContents] = useState<Content[]>([])
  const [editingContent, setEditingContent] = useState<Content | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingContent) return

    try {
      const response = await fetch('/api/content', {
        method: editingContent.id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingContent),
      })

      if (response.ok) {
        router.refresh()
        setEditingContent(null)
      }
    } catch (error) {
      console.error('Error saving content:', error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={editingContent?.title || ''}
            onChange={(e) => setEditingContent(prev => ({ ...prev!, title: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Section</label>
          <input
            type="text"
            value={editingContent?.section || ''}
            onChange={(e) => setEditingContent(prev => ({ ...prev!, section: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            value={editingContent?.content || ''}
            onChange={(e) => setEditingContent(prev => ({ ...prev!, content: e.target.value }))}
            rows={6}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Order</label>
          <input
            type="number"
            value={editingContent?.order || 0}
            onChange={(e) => setEditingContent(prev => ({ ...prev!, order: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Content
        </button>
      </form>
    </div>
  )
} 