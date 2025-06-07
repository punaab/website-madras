'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Editor } from '@tinymce/tinymce-react'
import { PlusIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline'

interface Content {
  section: string
  content: string
  title: string
  userId: string
  order?: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [contents, setContents] = useState<Content[]>([])
  const [editedContents, setEditedContents] = useState<Content[]>([])
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newSection, setNewSection] = useState<{
    title: string;
    content: string;
    section?: string;
    userId?: string;
  }>({ title: '', content: '' })
  const [sectionsToDelete, setSectionsToDelete] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Handle authentication state
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login')
    }
  }, [status, router])

  // Fetch content when session is available
  useEffect(() => {
    const fetchContent = async () => {
      if (status !== 'authenticated' || session?.user?.role !== 'ADMIN') return

      try {
        setIsLoading(true)
        const response = await fetch('/api/content', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`)
        }

        const data = await response.json()
        // Sort by order before setting state
        const sortedData = data.sort((a: Content, b: Content) => 
          (a.order || 0) - (b.order || 0)
        )
        setContents(sortedData)
        setEditedContents(sortedData)
        setError(null)
      } catch (error) {
        console.error('Error fetching content:', error)
        setError('Unable to load content. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [session, status])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check if the device is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener('resize', checkMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleContentChange = (section: string, value: string) => {
    setEditedContents(prevContents =>
      prevContents.map(content =>
        content.section === section
          ? { ...content, content: value }
          : content
      )
    )
    setIsEditing(true)
  }

  const handleTitleChange = (section: string, value: string) => {
    setEditedContents(prev => 
      prev.map(content => 
        content.section === section 
          ? { ...content, title: value }
          : content
      )
    )
  }

  const handleNewSectionChange = (field: keyof Content, value: string) => {
    setNewSection(prev => ({ ...prev, [field]: value }))
  }

  const handleAddSection = async () => {
    if (!newSection.content) {
      setError('Please fill in the section content');
      return;
    }

    if (!session?.user?.id) {
      setError('User not authenticated');
      return;
    }

    try {
      // Find the highest order value from editedContents
      const highestOrder = editedContents.length > 0
        ? Math.max(...editedContents.map(content => content.order ?? 0))
        : -1;

      const newSectionData: Content = {
        title: newSection.title || 'Untitled Section',
        content: newSection.content,
        section: `section_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId: session.user.id,
        order: highestOrder + 1
      };

      const response = await fetch('/api/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newSectionData.title,
          content: newSectionData.content,
          order: newSectionData.order,
          userId: session?.user?.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add section');
      }

      const savedSection = await response.json();
      
      // Update both states with the new section
      setEditedContents(prev => [...prev, savedSection]);
      setContents(prev => [...prev, savedSection]);
      setNewSection({ title: '', content: '' });
      setError(null);
      setSuccess('Section added successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error adding section:', error);
      setError('Failed to add section. Please try again.');
    }
  };

  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    const newContents = [...editedContents]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= newContents.length) return;

    // Swap the sections
    [newContents[index], newContents[newIndex]] = [newContents[newIndex], newContents[index]];

    // Update the order values
    newContents.forEach((content, idx) => {
      content.order = idx;
    });

    setEditedContents(newContents)
    setIsEditing(true)
  }

  const handleRemoveSection = async (section: string) => {
    try {
      // Update local state immediately
      setEditedContents(prevContents => {
        const newContents = prevContents.filter(content => content.section !== section);
        // Reorder remaining sections
        return newContents.map((content, index) => ({
          ...content,
          order: index
        }));
      });
      setIsEditing(true);
    } catch (error) {
      console.error('Error removing section:', error);
      setError('Failed to remove section');
    }
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // First, delete all sections that were removed
      const sectionsToDelete = contents
        .filter(content => !editedContents.some(edited => edited.section === content.section))
        .map(content => content.section);

      const deletePromises = sectionsToDelete.map(section =>
        fetch(`/api/content/${section}`, {
          method: 'DELETE',
        })
      );

      // Separate existing and new sections
      const existingSections = editedContents.filter(content => 
        contents.some(existing => existing.section === content.section)
      );
      const newSections = editedContents.filter(content => 
        !contents.some(existing => existing.section === content.section)
      );

      // Create new sections first
      const createPromises = newSections.map(section =>
        fetch('/api/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: section.title,
            content: section.content,
            section: section.section,
            order: section.order,
            userId: session?.user?.id
          }),
        })
      );

      // Then update existing sections
      const updatePromises = existingSections.map(content => 
        fetch(`/api/content/${content.section}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: content.title,
            content: content.content,
            order: content.order,
            userId: session?.user?.id
          }),
        })
      );

      // Wait for all operations to complete
      const results = await Promise.allSettled([
        ...deletePromises,
        ...createPromises,
        ...updatePromises
      ]);
      
      // Check for any failed operations
      const failedOperations = results.filter(
        (result): result is PromiseRejectedResult => result.status === 'rejected'
      );

      if (failedOperations.length > 0) {
        throw new Error(`${failedOperations.length} operations failed`);
      }

      // Update the main contents state with the edited contents
      setContents(editedContents);
      setIsEditing(false);
      setSuccess('Changes saved successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error('Error saving changes:', error);
      setError('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Sort contents by order when displaying
  const sortedContents = [...editedContents].sort((a, b) => (a.order || 0) - (b.order || 0))

  const editorConfig = {
    height: 300,
    menubar: false,
    plugins: [
      'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
      'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
      'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
    ],
    toolbar: 'undo redo | ' +
      'fontfamily fontsize | bold italic forecolor | alignleft aligncenter ' +
      'alignright alignjustify | bullist numlist outdent indent | ' +
      'removeformat | help',
    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
    font_family_formats: 'Times New Roman=times new roman,times; Arial=arial,helvetica,sans-serif; Helvetica=helvetica,arial,sans-serif; Georgia=georgia,times new roman,times; Verdana=verdana,geneva; Courier New=courier new,courier,monospace',
    font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt',
    skin: false,
    content_css: false,
    setup: (editor: any) => {
      editor.on('init', () => {
        editor.getBody().style.fontFamily = 'Helvetica, Arial, sans-serif';
        editor.getBody().style.fontSize = '14px';

        // Handle text selection based on device type
        if (isMobile) {
          // Mobile-specific selection handling
          editor.getBody().addEventListener('touchstart', (e: TouchEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'P' || target.tagName === 'DIV') {
              // Prevent default selection on mobile
              e.preventDefault();
              
              // Add a visual indicator for the selected text
              target.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
              target.style.borderRadius = '4px';
              
              // Show a custom selection menu
              const selectionMenu = document.createElement('div');
              selectionMenu.style.cssText = `
                position: absolute;
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 4px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                padding: 4px;
                z-index: 1000;
              `;
              
              const formatBtn = document.createElement('button');
              formatBtn.textContent = 'Format';
              formatBtn.style.cssText = `
                background: #f3f4f6;
                border: none;
                border-radius: 4px;
                padding: 4px 8px;
                margin: 0 2px;
                font-size: 12px;
                cursor: pointer;
              `;
              
              const deleteBtn = document.createElement('button');
              deleteBtn.textContent = 'Delete';
              deleteBtn.style.cssText = formatBtn.style.cssText;
              
              selectionMenu.appendChild(formatBtn);
              selectionMenu.appendChild(deleteBtn);
              
              // Position the menu near the touch point
              const touch = e.touches[0];
              selectionMenu.style.left = `${touch.clientX}px`;
              selectionMenu.style.top = `${touch.clientY}px`;
              
              document.body.appendChild(selectionMenu);
              
              // Remove the menu when touching elsewhere
              const removeMenu = () => {
                selectionMenu.remove();
                target.style.backgroundColor = '';
                target.style.borderRadius = '';
                document.removeEventListener('touchstart', removeMenu);
              };
              
              document.addEventListener('touchstart', removeMenu);
            }
          });
        }
      });
    },
    // Enable text selection on desktop
    object_resizing: !isMobile,
    resize: !isMobile,
    // Disable text selection on mobile
    readonly: isMobile
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Check for admin access
  if (!session?.user || session.user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You do not have permission to access this page.</p>
          <Link 
            href="/admin/login" 
            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
          >
            Return to Login
          </Link>
        </div>
      </div>
    )
  }

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50 h-16 overflow-hidden hover:h-auto transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <span className="hidden sm:inline text-gray-500">|</span>
              <span className="text-sm text-gray-600">{session?.user?.email}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="text-sm text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
              >
                View Site
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-red-600 hover:text-red-900 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSaveChanges}
              disabled={!isEditing || saving}
              className={`px-4 py-2 rounded-md text-white ${
                isEditing && !saving
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
          <Link
            href="/admin/users"
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-200 text-sm font-medium"
          >
            Manage Users
          </Link>
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-8">
          {sortedContents.map((content, index) => (
            <div key={content.section} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleMoveSection(index, 'up')}
                    disabled={index === 0}
                    className={`p-2 rounded ${
                      index === 0
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => handleMoveSection(index, 'down')}
                    disabled={index === sortedContents.length - 1}
                    className={`p-2 rounded ${
                      index === sortedContents.length - 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                    }`}
                  >
                    ↓
                  </button>
                </div>
                <button
                  onClick={() => handleRemoveSection(content.section)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
              {mounted && (
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                  value={content.content}
                  onEditorChange={(value: string) => handleContentChange(content.section, value)}
                  init={editorConfig}
                />
              )}
            </div>
          ))}
        </div>

        {/* Add New Section */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Section</h2>
          <div className="space-y-4">
            {mounted && (
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                value={newSection.content}
                onEditorChange={(value: string) => handleNewSectionChange('content', value)}
                init={{
                  height: 200,
                  menubar: false,
                  plugins: [
                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                  ],
                  toolbar: 'undo redo | ' +
                    'fontfamily fontsize | bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | help',
                  content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                  font_family_formats: 'Times New Roman=times new roman,times; Arial=arial,helvetica,sans-serif; Helvetica=helvetica,arial,sans-serif; Georgia=georgia,times new roman,times; Verdana=verdana,geneva; Courier New=courier new,courier,monospace',
                  font_size_formats: '8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt',
                  setup: (editor: any) => {
                    editor.on('init', () => {
                      editor.getBody().style.fontFamily = 'Helvetica, Arial, sans-serif';
                      editor.getBody().style.fontSize = '14px';
                    });
                  }
                }}
              />
            )}
            <button
              onClick={handleAddSection}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200 text-sm font-medium"
            >
              Add Section
            </button>
          </div>
        </div>
      </main>
    </div>
  )
} 