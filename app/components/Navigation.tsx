'use client'

import { useState } from 'react'
import Link from 'next/link'

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Height of the fixed header
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsMenuOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    setIsMenuOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={scrollToTop}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection('sacrament')}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              SACRAMENT
            </button>
            <button
              onClick={() => scrollToSection('message')}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              MESSAGE
            </button>
            <button
              onClick={() => scrollToSection('announcements')}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              ANNOUNCEMENTS
            </button>
            <button
              onClick={() => scrollToSection('more')}
              className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              MORE
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <button
              onClick={scrollToTop}
              className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium"
            >
              HOME
            </button>
            <button
              onClick={() => scrollToSection('sacrament')}
              className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium"
            >
              SACRAMENT
            </button>
            <button
              onClick={() => scrollToSection('message')}
              className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium"
            >
              MESSAGE
            </button>
            <button
              onClick={() => scrollToSection('announcements')}
              className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium"
            >
              ANNOUNCEMENTS
            </button>
            <button
              onClick={() => scrollToSection('more')}
              className="block w-full text-left text-gray-600 hover:text-gray-900 px-3 py-2 text-base font-medium"
            >
              MORE
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation 