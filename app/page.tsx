'use client'

import { useState, useEffect } from 'react'
import { useRef } from 'react'
import Link from 'next/link'
import Footer from './components/Footer'

interface Content {
  section: string
  content: string
  title: string
  order?: number
}

export default function Home() {
  const [contents, setContents] = useState<Content[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentDate, setCurrentDate] = useState('')
  const dateRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content', {
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        })
        
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`)
        }
        
        const data = await response.json()
        // Sort by order if available
        const sortedData = data.sort((a: Content, b: Content) => 
          (a.order || 0) - (b.order || 0)
        )
        setContents(sortedData)
        setError(null)
      } catch (error) {
        console.error('Error fetching content:', error)
        setError('Unable to load content. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchContent()
  }, [])

  useEffect(() => {
    const updateDate = () => {
      const date = new Date()
      const options: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }
      setCurrentDate(date.toLocaleDateString('en-US', options))
    }

    updateDate()
    // Update date at midnight
    const now = new Date()
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    const timeUntilMidnight = tomorrow.getTime() - now.getTime()

    const timer = setTimeout(() => {
      updateDate()
      // Set up daily updates
      setInterval(updateDate, 24 * 60 * 60 * 1000)
    }, timeUntilMidnight)

    return () => clearTimeout(timer)
  }, [])

  const scrollToContent = () => {
    if (dateRef.current) {
      const datePosition = dateRef.current.getBoundingClientRect().top + window.scrollY
      const startPosition = window.pageYOffset
      const distance = datePosition - startPosition
      const duration = 1500 // Duration in milliseconds (1.5 seconds)
      let start: number | null = null

      const animation = (currentTime: number) => {
        if (start === null) start = currentTime
        const timeElapsed = currentTime - start
        const progress = Math.min(timeElapsed / duration, 1)
        
        // Easing function for smooth acceleration and deceleration
        const easeInOutCubic = (t: number) => t < 0.5 
          ? 4 * t * t * t 
          : 1 - Math.pow(-2 * t + 2, 3) / 2

        window.scrollTo(0, startPosition + distance * easeInOutCubic(progress))

        if (timeElapsed < duration) {
          requestAnimationFrame(animation)
        }
      }

      requestAnimationFrame(animation)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div 
        className="relative h-[80vh] sm:h-[90vh] md:h-[100vh] w-full overflow-hidden cursor-pointer bg-white"
        onClick={scrollToContent}
      >
        <img
          src="/assets/images/church-logo-small.svg"
          alt="Church Logo"
          className="w-full h-full object-contain p-4 sm:p-6 md:p-8 transition-all duration-300 ease-in-out"
        />
      </div>

      {/* Date Display */}
      <div ref={dateRef} className="bg-gray-50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600 font-medium text-lg">
            {currentDate}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            MADRAS WARD
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            A WARM WELCOME TO ALL VISITORS
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {contents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No content available</p>
            </div>
          ) : (
            contents.map((content) => (
              <div key={content.section} className="bg-white shadow rounded-lg p-6">
                <div 
                  className="prose prose-lg max-w-none [&_*]:font-inherit [&_p]:my-4 [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:mb-3 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:mb-3 [&_h4]:text-xl [&_h4]:font-bold [&_h4]:mb-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_a]:text-blue-600 [&_a]:hover:text-blue-800 [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_pre]:bg-gray-100 [&_pre]:p-4 [&_pre]:rounded [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-gray-300 [&_th]:p-2 [&_td]:border [&_td]:border-gray-300 [&_td]:p-2 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded"
                  dangerouslySetInnerHTML={{ __html: content.content }} 
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
} 