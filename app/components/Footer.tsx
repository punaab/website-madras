'use client'

import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
          <Link 
            href="https://www.churchofjesuschrist.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Official Website
          </Link>
          <Link 
            href="https://www.churchofjesuschrist.org/study/scriptures/bofm?lang=eng" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Book of Mormon
          </Link>
          <Link 
            href="/api/auth/signin" 
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            Admin Login
          </Link>
        </div>
        <div className="mt-4 text-center text-gray-500 text-xs">
          © {new Date().getFullYear()} Madras Ward. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer 